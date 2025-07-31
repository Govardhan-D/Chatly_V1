import { supabase } from "../../lib/supabase";
import { useEffect, useRef, useState } from "react";
import { Database } from "../../supabase-types";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MessageBubble from "./Bubble";
import { FlashList } from "@shopify/flash-list";
import { FlatList } from "react-native";
type Message = Database["public"]["Tables"]["messages"]["Row"];

export default function ChatHistory() {
  const [messages, setMessages] = useState([]);
  const listRef = useRef<FlashList<Message[]>>(null);

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

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  console.log(messages);

  return (
    <View style={styles.container}>
      {messages.length == 0 ? (
        <Text>No Messages</Text>
      ) : (
        <FlashList
          ref={listRef}
          contentContainerStyle={styles.listContent}
          data={messages}
          renderItem={({ item }) => <MessageBubble message={item} />}
          keyExtractor={(item) => item.messageid.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get("window").height * 0.8,
    width: "100%",
  },
  listContent: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
