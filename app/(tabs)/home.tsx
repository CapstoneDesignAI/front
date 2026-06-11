import getTodayRecommendation from "@/api/recommendations/getTodayRecommendation";
import RecommendCard from "@/components/cards/RecommendCard";
import { useAuthStore } from "@/store/login/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const {
    data: todayRecommendation,
    isError: isTodayRecommendationError,
    isLoading: isTodayRecommendationLoading,
  } = useQuery({
    queryKey: ["TODAY_RECOMMENDATION", accessToken],
    queryFn: () => getTodayRecommendation(accessToken),
    enabled: Boolean(accessToken),
    retry: false,
  });
  const todayCard = todayRecommendation?.card;
  const todayPoint =
    todayCard?.ai_reason_summary ??
    todayRecommendation?.ai_reason_detail?.overview ??
    todayRecommendation?.ai_reason ??
    "오늘 떠나기 좋은 장소를 자연스럽게 이어봤어요.";
  const todaySubPoint =
    todayCard?.route_preview_text ??
    todayRecommendation?.summary?.duration_text ??
    todayRecommendation?.total_distance_text ??
    todayRecommendation?.estimated_time ??
    "장소 순서대로 부담 없이 따라갈 수 있는 코스예요.";
  const todayBadges =
    todayCard?.metric_badges ??
    [
      todayCard?.estimated_duration_text,
      todayCard?.estimated_cost_text,
      todayCard?.local_consumption_text,
    ].filter((badge): badge is string => Boolean(badge));

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-[20px] px-6 pb-[96px] pt-[14px]"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[14px] font-medium text-gray-02">
          오늘은 어디로 떠나볼까요?
        </Text>

        <Pressable
          accessibilityRole="button"
          className="h-[76px] flex-row items-center justify-between rounded-[24px] border border-gray-04 bg-white px-6"
          onPress={() => router.push("/custom-trip")}
        >
          <Text className="text-[18px] font-black text-gray-01">
            나만의 여행지 추천받기
          </Text>
          <View className="h-[28px] items-center justify-center rounded-full bg-main-green px-[18px]">
            <Text className="text-[12px] font-bold text-white">시작</Text>
          </View>
        </Pressable>

        <View className="gap-[10px]">
          <Text className="text-[14px] font-medium text-gray-02">
            {todayRecommendation?.section_title ?? "오늘의 추천 여행"}
          </Text>

          {!accessToken ? (
            <View className="min-h-[180px] items-center justify-center rounded-[22px] border border-gray-04 bg-white px-5">
              <Text className="text-[16px] font-bold text-gray-01">
                로그인이 필요해요
              </Text>
              <Text className="mt-2 text-center text-[13px] leading-5 text-gray-02">
                오늘의 추천 여행을 보려면 다시 로그인해 주세요.
              </Text>
            </View>
          ) : isTodayRecommendationLoading ? (
            <View className="min-h-[180px] items-center justify-center rounded-[22px] border border-gray-04 bg-white">
              <ActivityIndicator color="#739E6B" />
              <Text className="mt-3 text-[13px] font-medium text-gray-02">
                오늘의 추천을 불러오는 중이에요
              </Text>
            </View>
          ) : isTodayRecommendationError ? (
            <View className="min-h-[180px] items-center justify-center rounded-[22px] border border-gray-04 bg-white px-5">
              <Text className="text-[16px] font-bold text-gray-01">
                추천을 불러오지 못했어요
              </Text>
              <Text className="mt-2 text-center text-[13px] leading-5 text-gray-02">
                잠시 후 홈 화면을 다시 열어 확인해 주세요.
              </Text>
            </View>
          ) : todayRecommendation ? (
            <View>
              <RecommendCard recommendation={todayRecommendation} />

              <View className="z-10 -mb-[2px] -mt-[1px] h-[28px] items-center justify-center">
                <View className="absolute h-[28px] w-[6px] rounded-full bg-[#D6E8F0]" />
                <View className="absolute top-[2px] h-[11px] w-[11px] rounded-full border-[2px] border-white bg-[#D6E8F0]" />
                <View className="absolute bottom-[2px] h-[11px] w-[11px] rounded-full border-[2px] border-white bg-[#D6E8F0]" />
              </View>

              <View className="mx-[14px] rounded-[22px] border border-[#D9E3D3] bg-[#FDFFFB] px-5 py-[18px]">
                <View className="flex-row items-center gap-[8px]">
                  <View className="h-[8px] w-[8px] rounded-full bg-main-green" />
                  <Text className="text-[13px] font-bold text-main-green">
                    오늘의 추천 포인트
                  </Text>
                </View>
                <Text className="mt-[8px] text-[15px] font-medium leading-6 text-gray-01">
                  {todayPoint}
                </Text>
                <Text className="mt-[6px] text-[12px] leading-5 text-gray-02">
                  {todaySubPoint}
                </Text>
                {todayBadges.length ? (
                  <View className="mt-[12px] flex-row flex-wrap gap-[8px]">
                    {todayBadges.slice(0, 3).map((badge) => (
                      <View
                        key={badge}
                        className="rounded-full bg-white px-[10px] py-[6px]"
                      >
                        <Text className="text-[11px] font-bold text-main-green">
                          {badge}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            </View>
          ) : (
            <View className="min-h-[180px] items-center justify-center rounded-[22px] border border-gray-04 bg-white px-5">
              <Text className="text-[16px] font-bold text-gray-01">
                오늘 추천할 동선이 아직 없어요
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
