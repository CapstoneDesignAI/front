import { ScrollView, View } from "react-native";

import ToggleButton from "@/components/buttons/ToggleButton";
import RecommendCard from "@/components/cards/RecommendCard";
import { useState } from "react";

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
        {/* <RouteRecommendCard /> */}
        <RecommendCard recommendation={dummyData} />
      </View>
    </ScrollView>
  );
}
