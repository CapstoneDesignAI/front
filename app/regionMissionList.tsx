import getMissionsList from "@/api/missions/getMissionsList";
import MissionItem from "@/components/history/MissionItem";
import StampCoupon from "@/components/history/StampCoupon";
import { useAuthStore } from "@/store/login/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

const DEFAULT_REGION_ID = "1";

const fallbackMissions: IGetMissionItemResponse[] = [
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

  const { data: missionData, isLoading: isMissionsLoading } = useQuery({
    queryKey: ["MISSIONS", selectedRegionId, accessToken],
    queryFn: () => getMissionsList(accessToken, selectedRegionId),
    enabled: Boolean(accessToken),
    retry: false,
  });

  const missions = missionData?.length ? missionData : fallbackMissions;

  const { availableMissions, completedMissions } = useMemo(() => {
    return {
      availableMissions: missions.filter((m) => !m.is_completed),
      completedMissions: missions.filter((m) => m.is_completed),
    };
  }, [missions]);

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

        <View className="items-center gap-6">
          <StampCoupon
            title="강원 고성 스탬프 쿠폰"
            regionId={selectedRegionId}
            isMissionPage={true}
          />

          <View className="w-full gap-5">
            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-[18px] font-bold text-gray-01">
                  진행 중인 미션
                </Text>
                <Text className="text-[13px] font-medium text-gray-03">
                  {availableMissions.length}개
                </Text>
              </View>

              {availableMissions.map((mission) => (
                <MissionItem
                  key={mission.mission_id}
                  missionId={mission.mission_id}
                  title={mission.title}
                  difficulty={mission.difficulty}
                  isCompleted={false}
                  onPress={() =>
                    router.push({
                      pathname: "/MissionDetail",
                      params: { missionId: mission.mission_id },
                    })
                  }
                />
              ))}
              {availableMissions.length === 0 && !isMissionsLoading && (
                <View className="items-center py-4">
                  <Text className="text-[14px] text-gray-03">
                    모든 미션을 완료했습니다!
                  </Text>
                </View>
              )}
            </View>

            {completedMissions.length > 0 && (
              <View className="gap-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-[18px] font-bold text-gray-01">
                    완료한 미션
                  </Text>
                  <Text className="text-[13px] font-medium text-gray-03">
                    {completedMissions.length}개
                  </Text>
                </View>

                {completedMissions.map((mission) => (
                  <MissionItem
                    key={mission.mission_id}
                    missionId={mission.mission_id}
                    title={mission.title}
                    difficulty={mission.difficulty}
                    isCompleted={true}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
