import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface Props {
  title: string;
  size: "large" | "small";
  color: "gradient" | "active" | "orange" | "lightOrange" | "gray" | "disabled";
  onPress: () => void;
}

export default function Button({ title, size, color, onPress }: Props) {
  const BUTTON_SIZE =
    size === "large" ? "w-[300px] h-[52px]" : "w-[147px] h-[46px]";

  const TEXT_SIZE = size === "large" ? "text-[17px]" : "text-[15px]";

  const BUTTON_COLOR = {
    gradient: "", // LinearGradient로 처리
    active: "bg-main-green",
    orange: "bg-main-orange",
    lightOrange: "bg-main-light-orange",
    gray: "bg-gray-01",
    disabled: "bg-gray-04",
  }[color];

  const TEXT_COLOR = {
    gradient: "text-white",
    active: "text-white",
    orange: "text-gray-01",
    lightOrange: "text-gray-02",
    gray: "text-gray-01",
    disabled: "text-gray-02",
  }[color];

  const content = (
    <View className={`items-center justify-center w-full h-full`}>
      <Text className={`font-bold ${TEXT_SIZE} ${TEXT_COLOR}`}>{title}</Text>
    </View>
  );

  return (
    <Pressable
      className={`${BUTTON_SIZE} rounded-[10px] overflow-hidden`}
      onPress={onPress}
    >
      {color === "gradient" ? (
        <LinearGradient
          colors={["#F29B7F", "#A8B89A", "#7D9AAE"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          className="w-full h-full"
        >
          {content}
        </LinearGradient>
      ) : (
        <View className={`w-full h-full ${BUTTON_COLOR}`}>{content}</View>
      )}
    </Pressable>
  );
}
