import React from "react";
import { View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import AppNavigator from "./app/navigation/AppNavigator";
import AudioProvider from "./app/context/AudioProvider";
import AudioListItem from "./app/components/AudioListItem";
import color from "./app/misc/color";
import AudioList from "./app/screens/AudioList";

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: color.APP_BG,
  },
};

export default function App() {
  return (
    <AudioProvider>
      {/* <NavigationContainer theme={MyTheme}>
        <AppNavigator />
      </NavigationContainer> */}
      <AudioList />
    </AudioProvider>
    // <View style={{ marginTop: 50 }}>
    //   <AudioListItem />
    // </View>
  );
}
