import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";

type SmallEmblemType = "traveler" | "explorer" | "master";

type SmallEmblemItemProps = {
  type?: SmallEmblemType;
  title?: string;
  subtitle?: string;
  status?: string;
  isLocked?: boolean;
};

const EMBLEMS = {
  traveler: {
    title: "단양\n여행자",
    image: require("@/assets/svg/Danyang/Traveler.png"),
  },
  explorer: {
    title: "단양 로컬\n탐험가",
    image: require("@/assets/svg/Danyang/Explorer.png"),
  },
  master: {
    title: "단양\n마스터",
    image: require("@/assets/svg/Danyang/Master.png"),
  },
} as const;

export default function SmallEmblemItem({
  type = "explorer",
  title,
  subtitle,
  status = "획득 완료",
  isLocked = false,
}: SmallEmblemItemProps) {
  const emblem = EMBLEMS[type];

  return (
    <View className="h-[144px] w-[150px] items-center rounded-[12px] bg-white px-4 pt-[18px]">
      <View
        className={`h-[58px] w-[58px] items-center justify-center overflow-hidden rounded-full ${
          isLocked ? "bg-[#F0F0F0]" : "bg-main-light-orange"
        }`}
        style={{ borderColor: isLocked ? "#D9D9D9" : "#E0D6C2", borderWidth: 1 }}
      >
        {isLocked ? (
          <MaterialCommunityIcons name="help" size={22} color="#8C8C8C" />
        ) : (
          <Image
            source={emblem.image}
            className="h-full w-full"
            resizeMode="cover"
          />
        )}
      </View>

      <Text
        className="mt-[10px] text-center text-[14px] font-bold leading-[17px] text-gray-01"
        numberOfLines={2}
      >
        {title ?? subtitle ?? emblem.title}
      </Text>

      <Text className="mt-[2px] text-center text-[10px] leading-[13px] text-gray-03">
        {status}
      </Text>
    </View>
  );
}
