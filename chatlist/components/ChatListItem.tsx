import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { getUserById } from "../../lib/util";
import { Database } from "../../supabase-types";
import { useNavigation } from "@react-navigation/native";
export default function ChatListItem({
  chat_user_id,
}: {
  chat_user_id: string;
}) {
  const navigation = useNavigation();
  const [userData, setUserData] = useState<
    Database["public"]["Tables"]["users"]["Row"] | null
  >(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserById(chat_user_id);
        setUserData(userData);
        console.log("Fetched user data:", userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [chat_user_id]);

  return (
    <TouchableOpacity
      style={styles.MainView}
      onPress={() => {
        navigation.navigate("ChatScreen", { userId: chat_user_id });
      }}
    >
      <Image
        source={{
          uri: "https://documents.bcci.tv/resizedimageskirti/164_compress.png",
        }}
        style={styles.avatar}
      />

      <View style={styles.TextContainer}>
        <Text style={{ fontWeight: "600", fontSize: 16 }}>
          {userData?.username}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam
          lectus. Sed sit amet ipsum mauris.
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  MainView: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    gap: 12.5,
  },
  avatar: {
    borderRadius: 50,
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: "gray",
  },
  TextContainer: {
    flex: 1,
    overflow: "hidden",
    gap: 1.5,
  },
});
