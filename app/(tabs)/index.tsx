import KakaoButton from "@/components/buttons/KakaoButton";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-6">
        <View className="w-full bg-white p-6 rounded-[32px] shadow-sm">
          <Text className="text-[24px] font-bold text-gray-01 mb-2">
            Tailwind 작동 테스트
          </Text>
          <Text className="text-gray-02 leading-6 text-[16px]">
            이 텍스트의 색상과 배경의 둥근 모서리가 보인다면 Tailwind가
            정상적으로 적용된 것입니다.
          </Text>
          <Pressable className="mt-6 h-14 bg-main-01 items-center justify-center rounded-2xl">
            <Text className="text-white font-bold text-[17px]">확인 완료</Text>
          </Pressable>
          <KakaoButton />
        </View>
      </View>
    </View>
  );
}
