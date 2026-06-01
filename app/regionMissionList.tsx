import getMissionsList from "@/api/missions/getMissionsList";
import getStamps from "@/api/stampsAndEmblems/getStamps";
import MissionItem from "@/components/history/MissionItem";
import StampCoupon from "@/components/history/StampCoupon";
import { useAuthStore } from "@/store/login/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";

const DEFAULT_REGION_ID = "1";

const fallbackMissions = [
  {
    mission_id: "local-market-snack",
    title: "로컬 시장에서 간식 먹기",
    stamp_count: 1,
    difficulty: "쉬움",
    is_completed: false,
  },
  {
    mission_id: "beach-walk",
    title: "고성 바다 산책하기",
    stamp_count: 1,
    difficulty: "쉬움",
    is_completed: false,
  },
  {
    mission_id: "local-shop",
    title: "지역 상점 방문하기",
    stamp_count: 1,
    difficulty: "보통",
    is_completed: false,
  },
];

export default function RegionMissionListScreen() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { regionId } = useLocalSearchParams<{ regionId?: string }>();
  const selectedRegionId = regionId ?? DEFAULT_REGION_ID;

  const { data: stampData } = useQuery({
    queryKey: ["STAMPS", selectedRegionId, accessToken],
    queryFn: () => getStamps(accessToken, selectedRegionId),
    enabled: Boolean(accessToken),
    retry: false,
  });

  const { data: missionData, isLoading: isMissionsLoading } = useQuery({
    queryKey: ["MISSIONS", selectedRegionId, accessToken],
    queryFn: () => getMissionsList(accessToken, selectedRegionId),
    enabled: Boolean(accessToken),
    retry: false,
  });

  const missions = missionData?.length ? missionData : fallbackMissions;

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
          <StampCoupon
            title="강원 고성 스탬프 쿠폰"
            completedCount={stampData?.collected_stamps ?? 8}
            totalCount={stampData?.total_stamps ?? 10}
            rewardText={stampData?.next_reward_text}
            isMissionPage={true}
          />

          <View className="w-full gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-[18px] font-bold text-gray-01">
                오늘의 미션
              </Text>
              <Text className="text-[13px] font-medium text-gray-03">
                {isMissionsLoading ? "불러오는 중" : `${missions.length}개`}
              </Text>
            </View>

            {missions.map((mission) => (
              <MissionItem
                key={mission.mission_id}
                title={mission.title}
                rewardText={`사진 업로드 · 스탬프 ${mission.stamp_count}개`}
                difficulty={mission.difficulty}
                isCompleted={mission.is_completed}
                onPress={() =>
                  router.push({
                    pathname: "/MissionDetail",
                    params: { missionId: mission.mission_id },
                  })
                }
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
