import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Login from "./authorization/screens/Login";
import Verify from "./authorization/screens/Verify";
import ChatList from "./chatlist/screens/ChatList";
import ChatScreen from "./chat/screens/ChatScreen";

import { useEffect } from "react";
import useAuthStore from "./authorization/store/AuthStore";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Chats" component={ChatList} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();
function StackNavigator() {
  const { session } = useAuthStore();

  return (
    <Stack.Navigator>
      {!session ? (
        // Auth Stack
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Verify"
            component={Verify}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Main"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const { session } = useAuthStore();

  useEffect(() => {
    console.log("Session state:", session ? "Logged in" : "Logged out");
  }, [session]);

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <StackNavigator />
    </NavigationContainer>
  );
}
