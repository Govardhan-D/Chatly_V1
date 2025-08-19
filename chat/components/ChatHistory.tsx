import { useEffect, useRef, useState } from "react";
import { Database } from "../../supabase-types";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from "react-native";
import MessageBubble from "./Bubble";
import { FlashList } from "@shopify/flash-list";
import { useMessageStore } from "../../stores/MessageStore";
import { images } from "../../assets/images/images";
import { powersync } from "../../lib/powersync/system";

type MessageRecord = Database["public"]["Tables"]["messages"]["Row"];

interface ChatHistoryProps {
  chatId: string;
}

function useMessagesForChat(chatId: string) {
  const [messages, setMessages] = useState<MessageRecord[]>([]);

  useEffect(() => {
    const subscription = powersync.watch(
      "SELECT * FROM messages WHERE senderid = ? OR receiverid = ? ORDER BY timestamp ASC",
      [chatId, chatId],
      {
        onResult: (results) => {
          setMessages(results.rows?._array || []);
        },
        onError: (error) => {
          console.error("Error watching messages:", error);
        },
      }
    );
  }, [chatId]);

  return messages;
}

export default function ChatHistory({ chatId }: ChatHistoryProps) {
  const listRef = useRef<FlashList<MessageRecord>>(null);
  const messages = useMessagesForChat(chatId);

  return (
    <ImageBackground
      source={images.chatBg}
      resizeMode="cover"
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <View style={styles.container}>
        {messages.length === 0 ? (
          <Text>No Messages</Text>
        ) : (
          <FlashList
            ref={listRef}
            contentContainerStyle={styles.listContent}
            data={messages}
            renderItem={({ item }) => <MessageBubble message={item} />}
            keyExtractor={(item) => item.messageid.toString()}
            estimatedItemSize={200}
            initialScrollIndex={messages.length > 0 ? messages.length - 1 : 0}
          />
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get("window").height * 0.8,
    width: "100%",
  },
  listContent: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
