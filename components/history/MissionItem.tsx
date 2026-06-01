import { router } from "expo-router";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";

type MissionItemProps = {
  title?: string;
  rewardText?: string;
  difficulty?: string;
  buttonTitle?: string;
  imageSource?: ImageSourcePropType;
  isCompleted?: boolean;
  onPress?: () => void;
};

export default function MissionItem({
  title = "로컬 시장에서 간식 먹기",
  rewardText = "사진 업로드 · 스탬프 1개",
  difficulty = "쉬움",
  buttonTitle = "인증",
  imageSource,
  isCompleted = false,
  onPress,
}: MissionItemProps) {
  return (
    <View className="w-full flex-row items-center gap-4 rounded-[18px] bg-white p-4">
      <View className="h-[72px] w-[72px] overflow-hidden rounded-[14px] bg-[#F0F0F0]">
        {imageSource ? (
          <Image
            source={imageSource}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="h-full w-full items-center justify-center">
            <Text className="text-[12px] font-medium text-gray-03">미션</Text>
          </View>
        )}
      </View>

      <View className="min-w-0 flex-1 gap-2">
        <View className="gap-1">
          <Text
            className="text-[17px] font-bold leading-6 text-gray-01"
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            className="text-[13px] leading-5 text-gray-02"
            numberOfLines={1}
          >
            {rewardText}
          </Text>
        </View>

        <View className="flex-row items-center justify-between gap-3">
          <Text className="rounded-full bg-main-light-orange px-2.5 py-1 text-[12px] font-bold text-main-green">
            {isCompleted ? "완료" : difficulty}
          </Text>

          <Pressable
            className={`h-[34px] min-w-[72px] items-center justify-center rounded-full px-4 ${
              isCompleted ? "bg-gray-04" : "bg-[#FFEBE0]"
            }`}
            onPress={() => {
              if (onPress) {
                onPress();
                return;
              }

              router.push("/MissionDetail");
            }}
          >
            <Text
              className={`text-[14px] font-bold ${
                isCompleted ? "text-gray-02" : "text-main-orange"
              }`}
            >
              {isCompleted ? "완료" : buttonTitle}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
