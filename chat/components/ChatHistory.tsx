import { supabase } from "../../lib/supabase";
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

type Message = Database["public"]["Tables"]["messages"]["Row"];

interface ChatHistoryProps {
  chatId: string;
}

export default function ChatHistory({ chatId }: ChatHistoryProps) {
  const listRef = useRef<FlashList<Message>>(null);

  const allMessages = useMessageStore((state) => state.messages);
  const messages = allMessages.filter(
    (msg) => msg.senderid === chatId || msg.receiverid === chatId
  );
  if (messages.length > 0) {
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }

  return (
    <ImageBackground
      source={images.chatBg}
      resizeMode="cover"
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <View style={styles.container}>
        {allMessages.length == 0 ? (
          <Text>No Messages</Text>
        ) : (
          <FlashList
            ref={listRef}
            contentContainerStyle={styles.listContent}
            data={messages}
            renderItem={({ item }) => <MessageBubble message={item} />}
            keyExtractor={(item) => item.messageid.toString()}
            estimatedItemSize={65}
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
