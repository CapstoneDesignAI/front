import { ScrollView, View } from "react-native";

import ItemOptions from "@/components/history/ItemOptions";
import MissionItem from "@/components/history/MissionItem";
import StampCoupon from "@/components/history/StampCoupon";
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
      className="flex-1 bg-background px-6"
      contentContainerClassName="grow pb-[104px]"
      showsVerticalScrollIndicator={false}
    >
      <View className="">
        <ItemOptions />
        <StampCoupon />
        <MissionItem />
      </View>
    </ScrollView>
  );
}
