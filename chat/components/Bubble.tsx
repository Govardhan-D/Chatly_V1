import { View, Text, StyleSheet } from "react-native";
import { Database } from "../../supabase-types";
import useAuthStore from "../../authorization/store/AuthStore";

type Message = Database["public"]["Tables"]["messages"]["Row"];

export default function MessageBubble({ message }: { message: Message }) {
  const { user } = useAuthStore();
  const isSentByMe = message.senderid === user?.id;

  return (
    <View
      style={[
        styles.container,
        isSentByMe ? styles.sentContainer : styles.receivedContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isSentByMe ? styles.sentBubble : styles.receivedBubble,
        ]}
      >
        <Text style={styles.text}>{message.content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10,
    marginVertical: 4,
  },
  sentContainer: {
    alignItems: "flex-end",
  },
  receivedContainer: {
    alignItems: "flex-start",
  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: "80%",
    borderRadius: 16,
  },
  sentBubble: {
    backgroundColor: "#D0FECF",
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
});
