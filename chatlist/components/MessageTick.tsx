import { View, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function MessageTick({ status }: { status: string }) {
  if (status === "sent") {
    return <Ionicons name="checkmark" color="#767779" size={15} />;
  } else if (status === "delivered") {
    return <Ionicons name="checkmark-done" color="#767779" size={15} />;
  } else {
    return <Ionicons name="checkmark-done" color="#007BFC" size={15} />;
  }
}
