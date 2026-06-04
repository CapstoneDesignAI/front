import KakaoButton from "@/components/buttons/KakaoButton";
import { useAuthStore } from "@/store/login/useAuthStore";
import { Redirect } from "expo-router";
import React from "react";
import { ImageBackground, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HOME_BACKGROUND = require("@/assets/images/home-background.png");

export default function LandingScreen() {
  const isLogin = useAuthStore((state) => state.isLogin);
  const accessToken = useAuthStore((state) => state.accessToken);

  if (isLogin && accessToken) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <ImageBackground
      source={HOME_BACKGROUND}
      className="flex-1"
      imageClassName="opacity-90"
      resizeMode="cover"
    >
      <View className="absolute inset-0 bg-gray-01/30" />
      <SafeAreaView className="flex-1 justify-end px-6 pb-16">
        <View className="gap-3">
          <Text className="text-[38px] font-black text-white">Tripick</Text>
          <Text className="text-[15px] font-bold text-white/90">
            숨은 지역을 발견하는 AI 여행 플랫폼
          </Text>
          <Text className="text-[18px] font-bold leading-7 text-white">
            취향과 위치에 맞는 여행을 바로 시작해보세요.
          </Text>
        </View>

        <View className="mt-8 items-center rounded-[22px] border border-white/40 bg-background/90 px-5 py-5">
          <Text className="text-center text-[16px] font-bold text-gray-01">
            로그인하고 여행 기록을 이어가세요
          </Text>
          <Text className="mt-2 text-center text-[13px] font-medium leading-5 text-gray-02">
            카카오 로그인으로 추천 여행과 미션을 더 편하게 이용할 수 있어요.
          </Text>
          <KakaoButton />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
