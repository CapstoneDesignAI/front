import KakaoButton from "@/components/buttons/KakaoButton";
import ToggleButton from "@/components/buttons/ToggleButton";
import TripContext from "@/components/home/TripContext";
import { ThemedView } from "@/components/themed-view";
import { useAuthStore } from "@/store/login/useAuthStore";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

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
        <ThemedView className="flex-row w-full my-[20px] items-start justify-center bg-background">
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

        <View className="flex items-center justify-center p-6">
          <View className="w-full bg-main-05 p-6 rounded-[24px] border border-gray-04 shadow-sm">
            {isLogin ? (
              <Text className="text-main-02 mt-4 font-bold">로그인 상태입니다.</Text>
            ) : (
              <Text className="text-main-03 mt-4 font-bold">로그아웃 상태입니다.</Text>
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
