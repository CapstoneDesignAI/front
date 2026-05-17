import React, { useState } from "react";
import { View } from "react-native";
import Button from "./Button";

interface Props {
  leftTitle: string;
  rightTitle: string;
}

export default function ToggleButton({ leftTitle, rightTitle }: Props) {
  const [activeButton, setActiveButton] = useState<"left" | "right">("left");

  return (
    <View
      className={`w-[300px] h-[52px] p-[3px] rounded-[10px] bg-main-04 flex-row items-center justify-between`}
    >
      <Button title={leftTitle} size="small" color="gradient" />
      <Button title={rightTitle} size="small" color="lightOrange" />
    </View>
  );
}
