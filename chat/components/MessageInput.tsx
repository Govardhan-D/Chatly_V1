import { View, TextInput, TouchableOpacity, Image } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { sendMessage, uploadImage } from "../../lib/util";
import { useEffect, useState } from "react";
import { useAudioPlayer } from "expo-audio";
import { sound } from "../../assets/sounds/sound";
import * as DocumentPicker from "expo-document-picker";

export default function MessageInput({ chatId }: { chatId: string }) {
  const player = useAudioPlayer(sound.pop);

  const [content, setContent] = useState("");
  const [files, setFiles] =
    useState<DocumentPicker.DocumentPickerResult | null>(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setFiles(result);
      } else {
        console.log("Document picking cancelled");
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const handleChange = (text: string) => {
    setContent(text);
  };

  const uploadFile = async () => {
    try {
      const fileUri = files.assets[0].uri;
      const fileName = files.assets[0].name;
      const fileType = files.assets[0].mimeType;
      const file = { uri: fileUri, name: fileName, type: fileType };
      const mediaurl = await uploadImage(file, chatId);
      console.log("File uploaded successfully:", mediaurl);
      return mediaurl;
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSend = async () => {
    if (content.trim() == "") return;
    const receiverId = chatId;
    let mediaurl;
    if (files) {
      mediaurl = await uploadFile();
    }
    try {
      const message = await sendMessage(receiverId, content, mediaurl);
      player.seekTo(0);
      player.play();
      console.log("Message sent successfully:", message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setContent("");
    setFiles(null);
  };

  return (
    <View style={styles.container}>
      {files != null && files.assets.length > 0 && (
        <Image
          source={{ uri: files.assets[0].uri }}
          style={styles.ImagePreview}
        />
      )}
      <View style={styles.InputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={content}
          onChangeText={handleChange}
        />

        <TouchableOpacity onPress={pickDocument}>
          <MaterialCommunityIcons name="file" color="#767779" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSend}>
          <MaterialCommunityIcons
            name="send-circle"
            size={44}
            color="#1DAB61"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "100%",
    height: "auto",
    padding: 16,
    gap: 5,
  },
  InputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  ImagePreview: {
    width: 100,
    height: 100,
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
