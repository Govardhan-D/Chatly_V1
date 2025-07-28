import { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  Pressable,
  TextInput,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import useAuthStore from "../store/AuthStore";

export default function Login() {
  const { error, loginWithOtp, loading } = useAuthStore();
  const [phone, setPhone] = useState("");
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.SafeAreaView}>
        <Text style={styles.Header}>Enter your Email</Text>
        <TextInput
          placeholder="Enter your username"
          value={phone}
          onChangeText={setPhone}
          style={styles.TextInput}
        />

        <TextInput
          placeholder="example@email.com"
          value={phone}
          onChangeText={setPhone}
          style={styles.TextInput}
        />
        <Pressable
          onPress={() => loginWithOtp("", phone)}
          style={styles.Pressable}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.ButtonText}>Get OTP Now</Text>
          )}
        </Pressable>

        {error && <Text style={styles.errorText}>{error.message}</Text>}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  Header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "right",
  },
  SafeAreaView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  TextInput: {
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    width: "88%",
    fontSize: 16,
    marginBottom: 8,
  },
  Pressable: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    width: "88%",
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  ButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 20,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});
