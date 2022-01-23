import React from "react";
// import { View, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import color from "../misc/color";

const PlayerButton = (props) => {
  const {
    iconType,
    size = 40,
    iconColor = color.FONT,
    onPress,
    otherProps,
  } = props;

  const getIconName = (type) => {
    switch (type) {
      case "PLAY":
        return "pausecircle"; //realted to play
      case "PAUSE":
        return "playcircleo"; //realted to play
      case "NEXT":
        return "forward"; //realted to next
      case "PREV":
        return "banckward"; //realted to previous
    }
  };
  return (
    <AntDesign
      {...props}
      onPress={onPress}
      name={getIconName(iconType)}
      size={size}
      color={iconColor}
    />
  );
};

export default PlayerButton;
