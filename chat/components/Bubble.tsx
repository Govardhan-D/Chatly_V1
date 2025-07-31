import { View, Text, StyleSheet } from "react-native";
import { Database } from "../../supabase-types";

type Message = Database["public"]["Tables"]["messages"]["Row"];
export default function MessageBubble(message: Message) {
  return (
    <View>
      <Text>{message.content}</Text>
    </View>
  );
}
