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
  const { error, verifyOtp, loading, email } = useAuthStore();
  const [otp, setOtp] = useState("");
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.SafeAreaView}>
        <Text style={styles.Header}>We have sent the otp to {email}</Text>
        <TextInput
          placeholder="OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
          style={styles.TextInput}
        />

        <Pressable
          onPress={() => verifyOtp(email, otp)}
          style={styles.Pressable}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.ButtonText}>Verify OTP</Text>
          )}
        </Pressable>

        {error && <Text style={styles.errorText}>{error.message}</Text>}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  Header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
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
    marginBottom: 12,
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
