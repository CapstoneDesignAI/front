import RecommendCard from "@/components/cards/RecommendCard";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const dummyData = {
  route_id: "route-danyang-healing-half_day-walk-friends",
  title: "단양 감성 뷰 코스",
  sido: "충청북도",
  sigungu: "단양군",
  theme_label: "반나절",
  contribution_score: 86,
  ai_reason:
    "단양의 대표 자연 관광지와 지역 상권을 함께 경험할 수 있도록 구성했습니다.",
  total_distance_text: "약 12.4km",
  mobility: {
    level: "high",
    label: "이동 난이도 높음",
    recommended_transport: "도보",
  },
  places: [
    {
      order: 1,
      place_id: "sample-dodamsambong",
      name: "도담삼봉",
      category: "자연",
      address: "충북 단양군 매포읍 삼봉로 644",
      lat: 36.984539,
      lng: 128.369267,
      stay_minutes: 50,
      reason: "단양의 자연 경관을 먼저 체감할 수 있는 대표 장소입니다.",
    },
    {
      order: 2,
      place_id: "sample-danyang-market",
      name: "단양구경시장",
      category: "전통시장",
      address: "충북 단양군 단양읍 도전5길 31",
      lat: 36.982209,
      lng: 128.365089,
      stay_minutes: 60,
      reason: "로컬 먹거리와 소비를 함께 경험할 수 있는 장소입니다.",
    },
    {
      order: 3,
      place_id: "sample-namhangang",
      name: "남한강 잔도",
      category: "산책",
      address: "충북 단양군 적성면 애곡리",
      lat: 36.964938,
      lng: 128.382356,
      stay_minutes: 45,
      reason: "강변 풍경을 보며 산책하기 좋은 마무리 코스입니다.",
    },
  ],
} satisfies IPostAIRecommendationResponse;

export default function HomeScreen() {
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
            오늘의 추천 여행
          </Text>

          <View>
            <RecommendCard recommendation={dummyData} />

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
                {dummyData.ai_reason}
              </Text>
              <Text className="mt-[6px] text-[12px] leading-5 text-gray-02">
                자연 전망, 로컬 시장, 강변 산책이 이어지는 부담 없는 반나절
                코스예요.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
