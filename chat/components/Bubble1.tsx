import { View, Text, StyleSheet, Image } from "react-native";
import { Database } from "../../supabase-types";
import useAuthStore from "../../authorization/store/AuthStore";
import { supabase } from "../../lib/supabase";
import React, { useEffect } from "react";
import MessageTick from "../../chatlist/components/MessageTick";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

type Message = Database["public"]["Tables"]["messages"]["Row"];
function MessageBubble({ message }: { message: Message }) {
  const { user } = useAuthStore();
  const isSentByMe = message.senderid === user?.id;

  const position = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      position.value = e.translationX;
    })
    .onEnd((e) => {
      position.value = 0;
    });

  const updateMessageStatus = async () => {
    if (message.status != "seen") {
      supabase
        .from("messages")
        .update({ status: "seen" })
        .eq("messageid", message.messageid)
        .then(({ error }) => {
          if (error) {
            console.error("Failed to update status to delivered:", error);
          }
          console.log("No error");
        });
    }
  };
  useEffect(() => {
    if (!isSentByMe && message.status !== "seen") {
      updateMessageStatus();
    }
  }, [message.status]);
  return (
    <GestureDetector gesture={panGesture} touchAction="pan-y">
      <Animated.View
        style={[
          styles.container,
          isSentByMe ? styles.sentContainer : styles.receivedContainer,
          animatedStyle,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isSentByMe ? styles.sentBubble : styles.receivedBubble,
          ]}
        >
          {message.mediaurl != null && (
            <Image
              source={{
                uri: message.mediaurl,
              }}
              style={styles.media}
              resizeMode="cover"
            />
          )}
          <Text style={styles.text}>{message.content}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.timestamp}>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            {isSentByMe && <MessageTick status={message.status} />}
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10,
    marginVertical: 4,
  },
  media: {
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  sentContainer: {
    alignItems: "flex-end",
  },
  receivedContainer: {
    alignItems: "flex-start",
  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: "80%",
    borderRadius: 16,
  },
  sentBubble: {
    backgroundColor: "#D0FECF",
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    alignSelf: "flex-end",
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
  timestamp: {
    fontSize: 11,
    color: "#767779",
  },
});

export default React.memo(MessageBubble);
