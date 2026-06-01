import getMissionDetailItem from "@/api/missions/getMissionDetailItem";
import { useAuthStore } from "@/store/login/useAuthStore";
import { useQuery } from "@tanstack/react-query";
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
  missionId?: string;
  title?: string;
  rewardText?: string;
  difficulty?: string;
  buttonTitle?: string;
  imageSource?: ImageSourcePropType;
  isCompleted?: boolean;
  onPress?: () => void;
};

const DEFAULT_TITLE = "로컬 시장에서 간식 먹기";
const DEFAULT_REWARD_TEXT = "사진 업로드 · 스탬프 1개";
const DEFAULT_DIFFICULTY = "쉬움";

export default function MissionItem({
  missionId,
  title,
  rewardText,
  difficulty,
  buttonTitle = "인증",
  imageSource,
  isCompleted = false,
  onPress,
}: MissionItemProps) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data: missionDetail } = useQuery({
    queryKey: ["MISSION_DETAIL", missionId, accessToken],
    queryFn: () => getMissionDetailItem(accessToken, missionId ?? ""),
    enabled: Boolean(accessToken && missionId),
    retry: false,
  });

  const resolvedTitle = missionDetail?.title ?? title ?? DEFAULT_TITLE;
  const resolvedRewardText =
    missionDetail
      ? `${missionDetail.condition} · 스탬프 ${missionDetail.stamp_count}개`
      : rewardText ?? DEFAULT_REWARD_TEXT;
  const resolvedDifficulty = difficulty ?? DEFAULT_DIFFICULTY;

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
            {resolvedTitle}
          </Text>
          <Text
            className="text-[13px] leading-5 text-gray-02"
            numberOfLines={1}
          >
            {resolvedRewardText}
          </Text>
        </View>

        <View className="flex-row items-center justify-between gap-3">
          <Text className="rounded-full bg-main-light-orange px-2.5 py-1 text-[12px] font-bold text-main-green">
            {isCompleted ? "완료" : resolvedDifficulty}
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

              if (missionId) {
                router.push({
                  pathname: "/MissionDetail",
                  params: { missionId },
                });
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
