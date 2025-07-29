// In App.js in a new project

import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import Login from "./authorization/screens/Login";
import Verify from "./authorization/screens/Verify";

const RootStack = createNativeStackNavigator({
  screens: {
    Login: {
      screen: Login,
      options: {
        headerShown: false,
      },
    },
    Verify: {
      screen: Verify,
      options: {
        headerShown: false,
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <>
      <StatusBar hidden={true} />
      <Navigation />
    </>
  );
}
