import MissionItem from "@/components/history/MissionItem";
import StampCoupon from "@/components/history/StampCoupon";
import React from "react";
import { ScrollView, Text, View } from "react-native";

const missions = [
  {
    title: "로컬 시장에서 간식 먹기",
    rewardText: "사진 업로드 · 스탬프 1개",
    difficulty: "쉬움",
  },
  {
    title: "고성 바다 산책하기",
    rewardText: "위치 인증 · 스탬프 1개",
    difficulty: "쉬움",
  },
  {
    title: "지역 상점 방문하기",
    rewardText: "사진 업로드 · 스탬프 1개",
    difficulty: "보통",
  },
];

export default function RegionMissionListScreen() {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="grow px-6 pb-10 pt-5"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-6">
        <View className="gap-2">
          <Text className="text-[15px] leading-6 text-gray-02">
            현장에서 인증하고 스탬프를 모아보세요.
          </Text>
        </View>

        <View className="items-center gap-4">
          <StampCoupon />

          <View className="w-full gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-[18px] font-bold text-gray-01">
                오늘의 미션
              </Text>
              <Text className="text-[13px] font-medium text-gray-03">
                {missions.length}개
              </Text>
            </View>

            {missions.map((mission) => (
              <MissionItem
                key={mission.title}
                title={mission.title}
                rewardText={mission.rewardText}
                difficulty={mission.difficulty}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
