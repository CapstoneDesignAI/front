import { View, Text } from "react-native";
import React from "react";

interface Props {
  title: string;
  isActivated: boolean;
}

export default function Tag({ title, isActivated }: Props) {
  return (
    <View
      className={`items-center p-[5px] h-fit w-fit rounded-[5px] border ${isActivated ? "bg-main-03 border-main-01" : "bg-gray-04 border-gray-04"}`}
    >
      <Text className="text-[12px] text-gray-02">{title}</Text>
    </View>
  );
}
