import { View, TextInput, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { sendMessage } from "../../lib/util";
import { useState } from "react";

export default function MessageInput({ chatId }: { chatId: string }) {
  const [content, setContent] = useState("");
  const handleChange = (text: string) => {
    setContent(text);
  };
  const handleSend = async () => {
    if (content.trim() == "") return;
    const receiverId = chatId;

    try {
      const message = await sendMessage(receiverId, content);
      console.log("Message sent successfully:", message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setContent("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        value={content}
        onChangeText={handleChange}
      />
      <TouchableOpacity onPress={handleSend}>
        <MaterialCommunityIcons name="send-circle" size={44} color="#1DAB61" />
      </TouchableOpacity>
    </View>
  );
}

import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 5,
    height: "auto",
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 15,
    borderColor: "#000",
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 4,
    fontSize: 16,
  },
});
