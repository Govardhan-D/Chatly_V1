import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useAuthStore from "../../authorization/store/AuthStore";
import { useMessageStore } from "../../stores/MessageStore";
import MessageTick from "./MessageTick";
import { PowerSyncDatabase } from "../../lib/powersync/powersync-schema";
import { Database } from "../../supabase-types";

type LastMessage =
  Database["public"]["Functions"]["get_last_message_with_users"]["Returns"][0];
type Contact = PowerSyncDatabase["contacts"];

export default function ChatListItem({ contact }: { contact: Contact }) {
  const { user } = useAuthStore();
  const navigation = useNavigation();
  const allMessages = useMessageStore((state) => state.messages);

  const contactMessages = allMessages.filter(
    (msg) =>
      (msg.senderid === user.id && msg.receiverid === contact.contactuserid) ||
      (msg.senderid === contact.contactuserid && msg.receiverid === user.id)
  );

  const lastMessage = contactMessages.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];

  return (
    <TouchableOpacity
      style={styles.MainView}
      onPress={() => {
        navigation.navigate("ChatScreen", { userId: contact.contactuserid });
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
          {contact.nickname}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail">
          {lastMessage ? (
            lastMessage.senderid === user.id ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MessageTick status={lastMessage.status} />

                <Text style={{ color: "#767779" }}>{lastMessage.content}</Text>
              </View>
            ) : (
              <Text style={{ color: "#767779" }}>{lastMessage.content}</Text>
            )
          ) : (
            ""
          )}
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
