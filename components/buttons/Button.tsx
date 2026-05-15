import React from "react";
import { Pressable, Text } from "react-native";

interface Props {
  title: string;
  size: "large" | "small";
  color: "gradient" | "active" | "orange" | "lightOrange" | "gray" | "disabled";
}

export default function Button({ title, size, color }: Props) {
  const BUTTON_SIZE =
    size === "large" ? "w-[300px] h-[52px]" : "w-[147px] h-[46px]";

  const TEXT_SIZE = size === "large" ? "text-[17px]" : "text-[15px]";

  const BUTTON_COLOR = {
    gradient: "bg-gradient-to-r from-main-01 via-[#FFAA69] to-[#FF6330] ",
    active: "bg-main-01",
    orange: "bg-main-02",
    lightOrange: "bg-light-orange",
    gray: "bg-gray-01",
    disabled: "bg-gray-02",
  }[color];

  const TEXT_COLOR = {
    gradient: "text-white",
    active: "text-white",
    orange: "text-gray-01",
    lightOrange: "text-gray-02",
    gray: "text-gray-01",
    disabled: "text-gray-02",
  }[color];

  return (
    <Pressable
      className={`mt-6 ${BUTTON_SIZE} ${BUTTON_COLOR} items-center justify-center rounded-[10px]`}
    >
      <Text className={`font-bold ${TEXT_SIZE} ${TEXT_COLOR}`}>{title}</Text>
    </Pressable>
  );
}
