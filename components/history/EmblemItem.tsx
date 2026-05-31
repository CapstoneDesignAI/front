import React from "react";
import { Image, Pressable, Text, View } from "react-native";

type EmblemType = "traveler" | "explorer" | "master";

type EmblemItemProps = {
  type?: EmblemType;
  title?: string;
  label?: string;
  completedMissionCount?: number;
  acquiredDate?: string;
  buttonTitle?: string;
  onSharePress?: () => void;
};

const EMBLEMS = {
  traveler: {
    title: "단양 여행자",
    image: require("@/assets/svg/Danyang/Traveler.png"),
  },
  explorer: {
    title: "단양 로컬 탐험가",
    image: require("@/assets/svg/Danyang/Explorer.png"),
  },
  master: {
    title: "단양 마스터",
    image: require("@/assets/svg/Danyang/Master.png"),
  },
} as const;

export default function EmblemItem({
  type = "explorer",
  title,
  label = "대표 엠블럼",
  completedMissionCount = 5,
  acquiredDate = "2026.05.30",
  buttonTitle = "공유하기",
  onSharePress,
}: EmblemItemProps) {
  const emblem = EMBLEMS[type];

  return (
    <View className="w-full flex-row items-center gap-4 rounded-[22px] bg-white p-4">
      <View className="h-[86px] w-[86px] overflow-hidden rounded-[24px] bg-main-light-orange">
        <Image
          source={emblem.image}
          className="h-full w-full"
          resizeMode="cover"
        />
      </View>

      <View className="min-w-0 flex-1 gap-2">
        <View className="gap-1">
          <Text className="text-[14px] font-medium text-gray-02">{label}</Text>
          <Text
            className="text-[22px] font-black leading-7 text-gray-01"
            numberOfLines={1}
          >
            {title ?? emblem.title}
          </Text>
          <Text
            className="text-[14px] leading-5 text-gray-02"
            numberOfLines={1}
          >
            완료 미션 {completedMissionCount}개 · {acquiredDate} 획득
          </Text>
        </View>

        <Pressable
          className="h-[36px] w-[112px] items-center justify-center rounded-full bg-[#FFEBE0]"
          onPress={onSharePress}
        >
          <Text className="text-[14px] font-bold text-main-orange">
            {buttonTitle}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
