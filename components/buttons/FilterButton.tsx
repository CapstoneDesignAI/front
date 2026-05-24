import React from "react";
import { Pressable, Text } from "react-native";

interface Props {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

export default function FilterButton({ title, isSelected, onPress }: Props) {
  return (
    <Pressable
      className={`min-w-fit h-[36px] rounded-[20px] border ${isSelected ? "border-main-green bg-main-light-orange" : "border-gray-04 bg-background"}`}
      onPress={onPress}
    >
      <Text
        className={`text-[15px] h-[36px] px-[10px] py-[7px] ${isSelected ? "font-bold text-gray-01" : "text-gray-02"}`}
      >
        {title}
      </Text>
    </Pressable>
  );
}
