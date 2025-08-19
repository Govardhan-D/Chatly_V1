import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { View, Text } from "react-native";
import { getUserById } from "../../lib/util";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ChatHeader({ userId }: { userId: string }) {
  const [chatName, setChatname] = useState<string | null>(null);
  const navigation = useNavigation();
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
  const handleBackPress = () => {
    navigation.navigate("Main");
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBackPress}>
        <AntDesign name="arrowleft" color="#000" size={24} />
      </TouchableOpacity>

      <Text style={styles.header}>{chatName}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
  },
});
