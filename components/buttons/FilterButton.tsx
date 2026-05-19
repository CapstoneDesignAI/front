import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface Props {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

export default function FilterButton({ title, isSelected, onPress }: Props) {
  return (
    <Pressable
      className={`h-[36px] rounded-[20px] border ${isSelected ? "border-main-01" : "border-gray-02"} bg-white`}
      onPress={onPress}
    >
      <Text
        className={`text-[15px] w-full h-[36px] px-[10px] py-[7px] ${isSelected ? "text-main-01" : "text-gray-02"}`}
      >
        {title}
      </Text>
    </Pressable>
  );
}
