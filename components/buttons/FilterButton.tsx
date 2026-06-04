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
      className={`h-[38px] min-w-[62px] flex-row items-center justify-center gap-[6px] rounded-full px-[16px] ${
        isSelected ? "bg-main-green" : "border border-gray-04 bg-white"
      }`}
      onPress={onPress}
    >
      <Text
        className={`text-[14px] ${
          isSelected ? "font-bold text-white" : "font-semibold text-gray-02"
        }`}
        numberOfLines={1}
      >
        {title}
      </Text>
    </Pressable>
  );
}
