import React from "react";
import { Text, View } from "react-native";

interface Props {
  title: string;
  isActivated?: boolean;
  tone?: "green" | "orange" | "blue" | "gray";
  variant?: "filled" | "soft" | "outline";
  size?: "small" | "medium";
}

const TONE_CLASS = {
  green: {
    filled: "border-main-green bg-main-green",
    soft: "border-[#DCEFCF] bg-[#DCEFCF]",
    outline: "border-main-green bg-transparent",
    text: "text-main-green",
    filledText: "text-white",
  },
  orange: {
    filled: "border-main-orange bg-main-orange",
    soft: "border-[#FFE0D3] bg-[#FFE0D3]",
    outline: "border-main-orange bg-transparent",
    text: "text-main-orange",
    filledText: "text-white",
  },
  blue: {
    filled: "border-main-blue bg-main-blue",
    soft: "border-[#D6E8F0] bg-[#D6E8F0]",
    outline: "border-main-blue bg-transparent",
    text: "text-main-blue",
    filledText: "text-white",
  },
  gray: {
    filled: "border-gray-02 bg-gray-02",
    soft: "border-gray-04 bg-background",
    outline: "border-gray-04 bg-transparent",
    text: "text-gray-02",
    filledText: "text-white",
  },
};

export default function Tag({
  title,
  isActivated = false,
  tone = "gray",
  variant,
  size = "small",
}: Props) {
  const resolvedVariant = variant ?? (isActivated ? "soft" : "outline");
  const colors = TONE_CLASS[tone];
  const containerSize =
    size === "medium"
      ? "h-[30px] rounded-full px-[18px]"
      : "h-[22px] rounded-[4px] px-[8px]";
  const textSize = size === "medium" ? "text-[11px]" : "text-[11px]";
  const textColor =
    resolvedVariant === "filled" ? colors.filledText : colors.text;

  return (
    <View
      className={`items-center justify-center border ${containerSize} ${colors[resolvedVariant]}`}
    >
      <Text className={`${textSize} font-bold ${textColor}`}>{title}</Text>
    </View>
  );
}
