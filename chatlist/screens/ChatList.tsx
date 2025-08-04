import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Text, View, StyleSheet, Pressable } from "react-native";
import ChatListItem from "../components/ChatListItem";
import useAuthStore from "../../authorization/store/AuthStore";
import { useEffect, useState } from "react";
import { getContacts } from "../../lib/util";
import { FlashList } from "@shopify/flash-list";
export default function ChatList() {
  const { logout } = useAuthStore();
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contacts = await getContacts();
        setContacts(contacts);
        console.log("Fetched contacts:", contacts);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.SafeAreaView}>
        <View>
          <Text style={styles.Header}>Chat</Text>
        </View>
        <View style={styles.container}>
          <FlashList
            data={contacts}
            renderItem={({ item }) => <ChatListItem contact={item} />}
            estimatedItemSize={50}
            keyExtractor={(item) => item.contactuserid}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  borderBottomColor: "#c0c0c0ff",
                  borderBottomWidth: 1,
                  marginBottom: 10,
                  marginTop: 3,
                  width: "100%",
                }}
              />
            )}
          />
        </View>
        {/* Chat list content goes here */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
    padding: 16,
  },
  Header: {
    fontWeight: "bold",
    fontSize: 33.33,
  },
  container: {
    flex: 1,
    width: "100%",
    height: 300,
    paddingTop: 10,
  },
  listContent: {},
});
