import React from "react";
import { View } from "react-native";
import Button from "./Button";

interface Props {
  leftTitle: string;
  rightTitle: string;
  onLeftPress: () => void;
  onRightPress: () => void;
  activeButton: "left" | "right";
  setActiveButton?: (button: "left" | "right") => void;
}

export default function ToggleButton({
  leftTitle,
  rightTitle,
  onLeftPress,
  onRightPress,
  activeButton,
  setActiveButton,
}: Props) {
  return (
    <View
      className={`w-[300px] h-[52px] p-[3px] rounded-[10px] bg-main-04 flex-row items-center justify-between border border-gray-04`}
    >
      <Button
        title={leftTitle}
        size="small"
        color={activeButton === "left" ? "gradient" : "lightOrange"}
        onPress={onLeftPress}
      />
      <Button
        title={rightTitle}
        size="small"
        color={activeButton === "right" ? "gradient" : "lightOrange"}
        onPress={onRightPress}
      />
    </View>
  );
}
