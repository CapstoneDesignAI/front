import Button from "@/components/buttons/Button";
import KakaoButton from "@/components/buttons/KakaoButton";
import RecommendCard from "@/components/cards/RecommendCard";
import { useAuthStore } from "@/store/login/useAuthStore";
import { router } from "expo-router";
import React from "react";
import { ImageBackground, ScrollView, Text, View } from "react-native";

const HOME_BACKGROUND = require("@/assets/images/home-background.png");

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
  const { isLogin } = useAuthStore();

  return (
    <ImageBackground
      source={HOME_BACKGROUND}
      className="flex-1"
      imageClassName="opacity-95"
      resizeMode="cover"
    >
      <View className="absolute inset-0 bg-gray-01/20" />
      <View className="absolute inset-0 bg-main-light-orange/15" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow justify-end gap-5 px-6 pb-[190px] pt-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full rounded-[28px] border border-white/45 bg-background/65 p-5 shadow-lg">
          <View className="mb-5 gap-1">
            <Text className="text-[26px] font-black text-gray-01">
              오늘 어디로 떠날까요?
            </Text>
            <Text className="text-[14px] font-medium leading-5 text-gray-02">
              현재 위치와 취향에 맞춰 감성 여행지를 추천해드릴게요.
            </Text>
          </View>
          <View className="w-full items-center gap-3">
            <Button
              title="오늘의 추천"
              size="large"
              onPress={() => {
                return;
              }}
              color="gradient"
            />
            <Button
              title="커스텀 여행지 추천"
              size="large"
              onPress={() => router.push("/custom-trip")}
              color="active"
            />
          </View>
        </View>

        <View className="w-full rounded-[24px] border border-white/35 bg-background/65 p-5 shadow-sm">
          {isLogin ? (
            <Text className="text-main-green font-bold">
              로그인 상태입니다.
            </Text>
          ) : (
            <Text className="text-main-blue font-bold">
              로그아웃 상태입니다.
            </Text>
          )}
          <KakaoButton />
        </View>

        <RecommendCard recommendation={dummyData} />
      </ScrollView>
    </ImageBackground>
  );
}
