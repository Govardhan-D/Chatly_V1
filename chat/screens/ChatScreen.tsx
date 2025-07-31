import { useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { View, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import MessageInput from "../components/MessageInput";
import ChatHistory from "../components/ChatHistory";

interface ChatScreenProps {
  receiverID: string;
}
export default function ChatScreen({ receiverID }: ChatScreenProps) {
  const route = useRoute();
  const { userId } = route.params as { userId: string };
  useEffect(() => {
    // Fetch chat messages or user data based on userId
  }, [userId]);
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View>
          <Text>Chat with {userId}</Text>
          <ChatHistory />
          <MessageInput chatId={userId} />
          {/* Render chat messages and input field here */}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
