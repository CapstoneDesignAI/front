import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";

const routeDetails = {
  "gangneung-healing": {
    title: "강릉 초당 감성 힐링 코스",
    date: "2026.05.30 저장",
    estimatedTime: "약 6시간",
    description: "바다와 로컬 음식을 함께 즐기는 느긋한 강릉 동선이에요.",
    places: [
      {
        name: "안목해변 카페거리",
        address: "강원 강릉시 창해로 14",
        description: "바다를 보며 커피 한 잔으로 여행을 시작해요.",
      },
      {
        name: "초당순두부마을",
        address: "강원 강릉시 초당동",
        description: "고소한 순두부 음식으로 든든하게 쉬어가요.",
      },
      {
        name: "경포호",
        address: "강원 강릉시 저동",
        description: "호수 산책로를 따라 가볍게 걸으며 마무리해요.",
      },
    ],
  },
  "danyang-local": {
    title: "단양 로컬 산책 코스",
    date: "2026.05.28 저장",
    estimatedTime: "약 5시간",
    description: "시장, 야경, 강변 풍경을 이어서 보는 단양 대표 동선이에요.",
    places: [
      {
        name: "단양 구경시장",
        address: "충북 단양군 단양읍 도전5길 31",
        description: "마늘 만두와 로컬 간식을 먹으며 시장을 둘러봐요.",
      },
      {
        name: "수양개빛터널",
        address: "충북 단양군 적성면 수양개유적로 390",
        description: "빛 조형물과 터널 산책을 즐겨요.",
      },
      {
        name: "도담삼봉",
        address: "충북 단양군 매포읍 삼봉로 644",
        description: "강변 풍경을 보며 여행을 마무리해요.",
      },
    ],
  },
} as const;

export default function RouteDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const route =
    routeDetails[id as keyof typeof routeDetails] ??
    routeDetails["gangneung-healing"];

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="grow px-6 pb-10 pt-5"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-6">
        <View className="gap-2">
          <Text className="text-[28px] font-black text-gray-01">
            {route.title}
          </Text>
          <Text className="text-[15px] leading-6 text-gray-02">
            {route.description}
          </Text>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 rounded-[18px] bg-white p-4">
            <MaterialCommunityIcons
              name="clock-outline"
              size={22}
              color="#F08057"
            />
            <Text className="mt-2 text-[13px] text-gray-03">예상 시간</Text>
            <Text className="mt-1 text-[16px] font-bold text-gray-01">
              {route.estimatedTime}
            </Text>
          </View>
          <View className="flex-1 rounded-[18px] bg-white p-4">
            <MaterialCommunityIcons
              name="calendar-check-outline"
              size={22}
              color="#739E6B"
            />
            <Text className="mt-2 text-[13px] text-gray-03">저장일</Text>
            <Text className="mt-1 text-[16px] font-bold text-gray-01">
              {route.date.replace(" 저장", "")}
            </Text>
          </View>
        </View>

        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-[18px] font-bold text-gray-01">
              방문 순서
            </Text>
            <Text className="text-[13px] font-medium text-gray-03">
              {route.places.length}개 장소
            </Text>
          </View>

          <View className="rounded-[18px] bg-white p-5">
            {route.places.map((place, index) => {
              const isLast = index === route.places.length - 1;

              return (
                <View key={place.name} className="flex-row gap-3">
                  <View className="items-center">
                    <View className="h-8 w-8 items-center justify-center rounded-full bg-main-green">
                      <Text className="text-[14px] font-bold text-white">
                        {index + 1}
                      </Text>
                    </View>
                    {!isLast ? (
                      <View className="min-h-[62px] w-[2px] flex-1 bg-main-green" />
                    ) : null}
                  </View>

                  <View className="min-w-0 flex-1 pb-5">
                    <Text
                      className="text-[16px] font-bold text-gray-01"
                      numberOfLines={1}
                    >
                      {place.name}
                    </Text>
                    <Text className="mt-1 text-[13px] leading-5 text-gray-03">
                      {place.address}
                    </Text>
                    <Text className="mt-2 text-[14px] leading-5 text-gray-02">
                      {place.description}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
