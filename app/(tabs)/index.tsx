import KakaoButton from "@/components/buttons/KakaoButton";
import ToggleButton from "@/components/buttons/ToggleButton";
import { useAuthStore } from "@/store/login/useAuthStore";
import React, { useState } from "react";
import { Text, View } from "react-native";

export default function HomeScreen() {
  const { isLogin } = useAuthStore();
  const [activeButton, setActiveButton] = useState<"left" | "right">("left"); // 예시로 왼쪽 버튼이 활성화된 상태로 설정

  const handleLeftPress = () => {
    setActiveButton("left");
  };
  const handleRightPress = () => {
    setActiveButton("right");
  };

  return (
    <View className="flex-1 bg-background items-center">
      <ToggleButton
        leftTitle="내 장소"
        rightTitle="내 동선"
        onLeftPress={handleLeftPress}
        onRightPress={handleRightPress}
        activeButton={activeButton}
        setActiveButton={setActiveButton}
      />
      <View className="flex-1 items-center justify-center p-6">
        <View className="w-full bg-white p-6 rounded-[32px] shadow-sm">
          <Text className="text-[24px] font-bold text-gray-01 mb-2">
            Tailwind 작동 테스트
          </Text>
          <Text className="text-gray-02 leading-6 text-[16px]">
            이 텍스트의 색상과 배경의 둥근 모서리가 보인다면 Tailwind가
            정상적으로 적용된 것입니다.
          </Text>
          {isLogin ? (
            <Text className="text-green-500 mt-4">로그인 상태입니다.</Text>
          ) : (
            <Text className="text-red-500 mt-4">로그아웃 상태입니다.</Text>
          )}
          <KakaoButton />
        </View>
      </View>
    </View>
  );
}
