import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import Login from "./authorization/screens/Login";
import Verify from "./authorization/screens/Verify";
import ChatList from "./chatlist/screens/ChatList";
import ChatScreen from "./chat/screens/ChatScreen";
import Profile from "./profile/screens/Profile";
import { useRealTimeSync } from "./hooks/useRealTimeSync";

import { use, useEffect } from "react";
import useAuthStore from "./authorization/store/AuthStore";

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Chats") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#1DAB61",
        tabBarInactiveTintColor: "#767779",
      })}
    >
      <Tab.Screen name="Chats" component={ChatList} />
      <Tab.Screen name="Profile" component={Profile} />
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
  console.log("App component rendered. ");
  useRealTimeSync();

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <StackNavigator />
    </NavigationContainer>
  );
}
