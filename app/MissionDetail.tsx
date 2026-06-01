import getMissionDetailItem from "@/api/missions/getMissionDetailItem";
import { useAuthStore } from "@/store/login/useAuthStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const fallbackMissionDetail: IGetMissionDetailItemResponse = {
  mission_id: "local-market-snack",
  title: "로컬 시장에서 간식 먹기",
  condition: "고성 전통시장 근처에서 지역 간식을 먹고 사진으로 인증해보세요.",
  stamp_count: 1,
  place_name: "고성 전통시장",
  distance_text: "미션 장소 반경 300m 안에서 인증",
};

export default function MissionDetailScreen() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { missionId } = useLocalSearchParams<{ missionId?: string }>();
  const selectedMissionId = missionId ?? fallbackMissionDetail.mission_id;

  const { data: missionDetail } = useQuery({
    queryKey: ["MISSION_DETAIL", selectedMissionId, accessToken],
    queryFn: () => getMissionDetailItem(accessToken, selectedMissionId),
    enabled: Boolean(accessToken && selectedMissionId),
    retry: false,
  });

  const mission = missionDetail ?? fallbackMissionDetail;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="grow px-6 pb-10 pt-5"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-6">
        <View className="h-[220px] items-center justify-center rounded-[24px] bg-[#F0F0F0]">
          <MaterialCommunityIcons
            name="image-outline"
            size={42}
            color="#A59A93"
          />
          <Text className="mt-2 text-[15px] font-medium text-gray-03">
            사진 영역
          </Text>
        </View>

        <View className="gap-2">
          <Text className="text-[28px] font-black text-gray-01">
            {mission.title}
          </Text>
          <Text className="text-[15px] leading-6 text-gray-02">
            {mission.condition}
          </Text>
        </View>

        <View className="gap-4 rounded-[18px] border border-gray-04 bg-white px-5 py-5">
          <Text className="text-[20px] font-bold text-gray-01">
            미션 조건
          </Text>
          {[
            `${mission.place_name} 근처에서 진행`,
            mission.distance_text,
            `인증 완료 시 스탬프 ${mission.stamp_count}개 획득`,
          ].map((condition) => (
            <View key={condition} className="flex-row gap-2">
              <Text className="text-[15px] leading-6 text-main-green">•</Text>
              <Text className="flex-1 text-[15px] leading-6 text-gray-02">
                {condition}
              </Text>
            </View>
          ))}
        </View>

        <Pressable
          className="h-[52px] items-center justify-center rounded-[16px] bg-main-orange"
          onPress={() =>
            router.push({
              pathname: "/MissionVerification",
              params: {
                missionId: mission.mission_id,
                title: mission.title,
                distanceText: mission.distance_text,
              },
            })
          }
        >
          <Text className="text-[17px] font-bold text-white">
            미션 시작하기
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
