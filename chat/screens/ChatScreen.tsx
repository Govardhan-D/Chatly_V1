import { useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import MessageInput from "../components/MessageInput";
import ChatHistory from "../components/ChatHistory";
import ChatHeader from "../components/ChatHeader";

export default function ChatScreen() {
  const route = useRoute();
  const { userId } = route.params as { userId: string };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <ChatHeader userId={userId} />
          <View style={styles.chatContainer}>
            <ChatHistory />
            <MessageInput chatId={userId} />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  keyboardView: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
