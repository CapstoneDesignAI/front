import Button from "@/components/buttons/Button";
import FilterButton from "@/components/buttons/FilterButton";
import KakaoButton from "@/components/buttons/KakaoButton";
import ToggleButton from "@/components/buttons/ToggleButton";
import PlaceRecommendCard from "@/components/home/cards/PlaceRecommendCard";
import TripContext from "@/components/home/TripContext";
import { ThemedView } from "@/components/themed-view";
import { useAuthStore } from "@/store/login/useAuthStore";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const activity_style = ["휴식 중심", "액티비티 중심", "맛집 중심", "관광 중심"];
const allergies = ["견과류", "갑각류", "유제품", "기타(직접입력"];
const pref_mood = ["조용한", "감성적인", "활기찬", "로컬 느낌", "힙한 분위기"];
const pref_transport = ["많이 걷기 가능", "대중교통 선호", "이동 최소화 선호"];

export default function HomeScreen() {
  const { isLogin } = useAuthStore();
  const [activeButton, setActiveButton] = useState<"left" | "right">("left"); // 예시로 왼쪽 버튼이 활성화된 상태로 설정
  const [isTripContextOpen, setIsTripContextOpen] = useState(true);

  const handleLeftPress = () => {
    setActiveButton("left");
  };
  const handleRightPress = () => {
    setActiveButton("right");
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView className="flex-row w-full my-[20px] items-start justify-center">
          <ToggleButton
            leftTitle="장소 추천"
            rightTitle="동선 추천"
            onLeftPress={handleLeftPress}
            onRightPress={handleRightPress}
            activeButton={activeButton}
            setActiveButton={setActiveButton}
          />
        </ThemedView>
        <TripContext
          isOpen={isTripContextOpen}
          onToggle={() => setIsTripContextOpen((prev) => !prev)}
        />

        <PlaceRecommendCard />

        <View className="flex items-center justify-center p-6">
          <View className="w-full bg-white p-6 rounded-[32px] shadow-sm">
            {isLogin ? (
              <Text className="text-green-500 mt-4">로그인 상태입니다.</Text>
            ) : (
              <Text className="text-red-500 mt-4">로그아웃 상태입니다.</Text>
            )}
            <KakaoButton />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: "center",
    flexGrow: 1,
    paddingBottom: 180,
  },
});
