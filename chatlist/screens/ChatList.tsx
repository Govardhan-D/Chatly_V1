import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Text, View, StyleSheet, Pressable } from "react-native";
import ChatListItem from "../components/ChatListItem";
import useAuthStore from "../../authorization/store/AuthStore";
import { useEffect, useState } from "react";
import { getContacts } from "../../lib/util";
export default function ChatList() {
  const { logout } = useAuthStore();
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contacts = await getContacts();
        setContacts(contacts);
        console.log("Fetched contacts:", contacts[0]);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.SafeAreaView}>
        <View style={styles.View}>
          <Text style={styles.Header}>Chat</Text>
        </View>
        <ChatListItem chat_user_id={contacts[0]?.contactuserid} />
        <Pressable
          onPress={() => logout()}
          style={{ padding: 10, backgroundColor: "#007AFF", borderRadius: 5 }}
        >
          <Text style={{ color: "#FFFFFF", textAlign: "center" }}>Logout</Text>
        </Pressable>

        {/* Chat list content goes here */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 5,
  },
  View: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  Header: {
    fontWeight: "bold",
    fontSize: 33.33,
  },
});
