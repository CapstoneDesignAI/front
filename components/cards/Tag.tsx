import { View, Text } from "react-native";
import React from "react";

interface Props {
  title: string;
  isActivated: boolean;
}

export default function Tag({ title, isActivated }: Props) {
  return (
    <View
      className={`items-center p-[5px] h-fit w-fit rounded-[8px] border ${isActivated ? "bg-main-04 border-main-02" : "bg-background border-gray-04"}`}
    >
      <Text className={`text-[12px] ${isActivated ? "font-bold text-gray-01" : "text-gray-02"}`}>{title}</Text>
    </View>
  );
}
