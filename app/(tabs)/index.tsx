import Button from "@/components/buttons/Button";
import KakaoButton from "@/components/buttons/KakaoButton";
import RecommendCard from "@/components/cards/RecommendCard";
import { useAuthStore } from "@/store/login/useAuthStore";
import { router } from "expo-router";
import React from "react";
import { ImageBackground, ScrollView, Text, View } from "react-native";

const HOME_BACKGROUND = require("@/assets/images/home-background.png");

const dummyData = {
  title: "강릉 초당 감성 힐링 데이트 코스",
  estimated_time: "약 6시간",
  places: [
    {
      visit_order: 1,
      name: "강릉 안목해변 카페거리",
      address: "강원 강릉시 창해로 14",
      description:
        "바다 풍경을 바라보며 시원한 커피 한 잔으로 여행을 잔잔하게 시작합니다.",
    },
    {
      visit_order: 2,
      name: "초당순두부마을",
      address: "강원 강릉시 초당동",
      description: "점심식사로 자극적이지 않고 고소한 짬뽕순두부를 즐깁니다.",
    },
  ],
};

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
