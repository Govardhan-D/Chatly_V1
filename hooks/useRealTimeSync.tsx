// hooks/useRealTimeSync.tsx
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useMessageStore } from "../stores/MessageStore";
import { Database } from "../supabase-types";
import { mmkvStorage } from "../lib/MMKV";

const STORAGE_KEY = "messages";

type Message = Database["public"]["Tables"]["messages"]["Row"];

export const useRealTimeSync = () => {
  const { messages, setMessages, addMessage, updateMessage, deleteMessage } =
    useMessageStore();

  useEffect(() => {
    const hydrateMessages = async () => {
      try {
        // Local storage sync (MMKV)
        const cached = mmkvStorage.getString(STORAGE_KEY);
        if (cached) {
          const localMessages = JSON.parse(cached) as Message[];
          setMessages(localMessages);
        }

        // Supabase sync
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .order("timestamp", { ascending: true });

        if (error) {
          console.error("Supabase fetch error:", error);
          return;
        }

        if (data) {
          setMessages(data);
          mmkvStorage.set(STORAGE_KEY, JSON.stringify(data));
        }
      } catch (error) {
        console.error("Hydration error:", error);
      }
    };

    hydrateMessages();

    const channel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => {
          if (!messages) return;

          let updatedMessages: Message[] = [...messages];

          switch (payload.eventType) {
            case "INSERT": {
              const newMessage = payload.new as Message;
              addMessage(newMessage);
              updatedMessages = [...updatedMessages, newMessage];
              break;
            }

            case "UPDATE": {
              const updatedMessage = payload.new as Message;
              updateMessage(updatedMessage);
              updatedMessages = updatedMessages.map((msg) =>
                msg.messageid === updatedMessage.messageid
                  ? updatedMessage
                  : msg
              );
              break;
            }

            case "DELETE": {
              const deletedMessage = payload.old as Message;
              deleteMessage(deletedMessage.messageid);
              updatedMessages = updatedMessages.filter(
                (msg) => msg.messageid !== deletedMessage.messageid
              );
              break;
            }
          }

          try {
            mmkvStorage.set(STORAGE_KEY, JSON.stringify(updatedMessages));
          } catch (error) {
            console.error("MMKV write error:", error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
};
