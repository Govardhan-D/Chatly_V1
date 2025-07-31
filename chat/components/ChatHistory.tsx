import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { Database } from "../../supabase-types";
import { View, Text } from "react-native";

type Message = Database["public"]["Tables"]["messages"]["Row"];

export default function ChatHistory() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "messages",
        },
        (payload) => {
          console.log("Message change detected:", payload);

          switch (payload.eventType) {
            case "INSERT":
              setMessages((prev) => [...prev, payload.new as Message]);
              break;
            case "UPDATE":
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.messageid === payload.new.messageid
                    ? (payload.new as Message)
                    : msg
                )
              );
              break;
            case "DELETE":
              setMessages((prev) =>
                prev.filter((msg) => msg.messageid !== payload.old.messageid)
              );
              break;
          }
        }
      )
      .subscribe();

    // Fetch existing messages on component mount
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("timestamp", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      setMessages(data);
    };

    fetchMessages();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <View>
      {messages.map((message) => (
        <Text key={message.messageid}>{message.content}</Text>
      ))}
    </View>
  );
}
