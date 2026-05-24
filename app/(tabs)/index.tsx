import Button from "@/components/buttons/Button";
import KakaoButton from "@/components/buttons/KakaoButton";
import { useAuthStore } from "@/store/login/useAuthStore";
import { router } from "expo-router";
import React from "react";
import { ImageBackground, ScrollView, Text, View } from "react-native";

const HOME_BACKGROUND = require("@/assets/images/home-background.png");

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
      </ScrollView>
    </ImageBackground>
  );
}
