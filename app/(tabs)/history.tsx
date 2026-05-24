import { ScrollView, View } from "react-native";

import ToggleButton from "@/components/buttons/ToggleButton";
import RouteRecommendCard from "@/components/cards/RouteRecommendCard";
import { useState } from "react";

export default function HistoryScreen() {
  const [activeButton, setActiveButton] = useState<"left" | "right">("left"); // 예시로 왼쪽 버튼이 활성화된 상태로 설정

  const handleLeftPress = () => {
    setActiveButton("left");
  };
  const handleRightPress = () => {
    setActiveButton("right");
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="grow pb-[104px]"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 bg-background p-[10px]">
        <View className="flex-row w-full my-[20px] items-start justify-center bg-background">
          <ToggleButton
            leftTitle="내 동선"
            rightTitle="이전 기록"
            onLeftPress={handleLeftPress}
            onRightPress={handleRightPress}
            activeButton={activeButton}
            setActiveButton={setActiveButton}
          />
        </View>
        <RouteRecommendCard />
      </View>
    </ScrollView>
  );
}
