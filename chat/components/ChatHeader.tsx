import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { View, Text } from "react-native";
import { getUserById } from "../../lib/util";
import { TouchableOpacity } from "react-native";

export default function ChatHeader({ userId }: { userId: string }) {
  const [chatName, setChatname] = useState<string | null>(null);
  useEffect(() => {
    const fetchChatName = async () => {
      try {
        const user = await getUserById(userId);
        if (user) {
          setChatname(user.username);
        } else {
          setChatname("Unknown User");
        }
      } catch (error) {
        console.error("Error fetching chat name:", error);
        setChatname("Error");
      }
    };

    fetchChatName();
  }, [userId]);
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <AntDesign name="arrowleft" color="#000" size={24} />
      </TouchableOpacity>

      <Text style={styles.header}>{chatName}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 36,
    alignItems: "center",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
  },
});
