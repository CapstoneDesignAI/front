import Tag from "@/components/cards/Tag";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const routeDetails: Record<string, IPostAIRecommendationResponse> = {
  "route-danyang-healing-half_day-walk-friends": {
    route_id: "route-danyang-healing-half_day-walk-friends",
    title: "단양 감성 뷰 코스",
    sido: "충청북도",
    sigungu: "단양군",
    theme_label: "힐링",
    contribution_score: 86,
    ai_reason:
      "짧은 이동 안에 전망, 산책, 로컬 소비를 균형 있게 배치했어요.",
    total_distance_text: "약 12.4km",
    mobility: {
      level: "high",
      label: "이동 난이도 높음",
      recommended_transport: "뚜벅이",
    },
    places: [
      {
        order: 1,
        place_id: "sample-danyang-market",
        name: "단양구경시장",
        category: "전통시장",
        address: "충북 단양군 단양읍 도전5길 31",
        lat: 36.982209,
        lng: 128.365089,
        stay_minutes: 60,
        reason: "로컬 먹거리와 시장 골목을 함께 즐기기 좋은 곳",
      },
      {
        order: 2,
        place_id: "sample-dodamsambong",
        name: "도담삼봉",
        category: "자연",
        address: "충북 단양군 매포읍 삼봉로 644",
        lat: 36.984539,
        lng: 128.369267,
        stay_minutes: 50,
        reason: "단양의 자연 경관을 먼저 체감할 수 있는 대표 장소입니다.",
      },
      {
        order: 3,
        place_id: "sample-namhangang",
        name: "남한강 잔도",
        category: "산책",
        address: "충북 단양군 적성면 애곡리",
        lat: 36.964938,
        lng: 128.382356,
        stay_minutes: 45,
        reason: "강변 풍경을 보며 산책하기 좋은 마무리 코스입니다.",
      },
    ],
  },
};

const defaultRoute = routeDetails["route-danyang-healing-half_day-walk-friends"];

const getPlaceOrder = (place: IPlaceItem) =>
  place.order ?? place.visit_order ?? 0;

const getPlaceDescription = (place: IPlaceItem) =>
  place.reason ?? place.description ?? "방문하기 좋은 추천 장소입니다.";

export default function RouteDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const route = routeDetails[id ?? ""] ?? defaultRoute;

  const places = useMemo(() => {
    return [...route.places].sort(
      (prev, next) => getPlaceOrder(prev) - getPlaceOrder(next),
    );
  }, [route.places]);

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-[108px] pt-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-[32px]">
          <View className="gap-[8px]">
            <Text className="text-[28px] font-black text-gray-01">
              추천 동선
            </Text>
            <Text className="text-[14px] font-medium text-gray-02">
              AI가 고른 이유와 장소 순서를 확인해요
            </Text>
          </View>

          <View className="rounded-[28px] bg-[#315C32] px-6 py-[28px]">
            <Text
              className="text-[26px] font-black text-white"
              numberOfLines={2}
            >
              {route.title}
            </Text>
            <Text className="mt-[8px] text-[13px] font-medium leading-5 text-white">
              남한강 전망과 로컬 소비를 함께 담은 반나절 코스
            </Text>

            <View className="mt-[20px] flex-row flex-wrap gap-[8px]">
              <Tag title="태그" tone="green" variant="filled" size="medium" />
              <Tag
                title={route.theme_label ?? "태그"}
                tone="orange"
                variant="filled"
                size="medium"
              />
              <Tag
                title={`장소 ${places.length}곳`}
                tone="blue"
                variant="filled"
                size="medium"
              />
            </View>
          </View>

          <View className="rounded-[22px] border border-gray-04 bg-white px-[22px] py-[20px]">
            <Text className="text-[17px] font-black text-gray-01">
              AI 추천 이유
            </Text>
            <Text className="mt-[10px] text-[13px] leading-5 text-gray-02">
              {route.ai_reason}
            </Text>
          </View>

          <View className="gap-[10px]">
            {places.map((place, index) => (
              <View
                key={place.place_id ?? `${place.name}-${index}`}
                className="min-h-[90px] flex-row items-center rounded-[20px] border border-gray-04 bg-white px-[18px] py-[12px]"
              >
                <View className="h-[36px] w-[36px] items-center justify-center rounded-full bg-main-green">
                  <Text className="text-[15px] font-bold text-white">
                    {getPlaceOrder(place) || index + 1}
                  </Text>
                </View>

                <View className="ml-[14px] min-w-0 flex-1">
                  <View className="flex-row items-baseline gap-[6px]">
                    <Text
                      className="text-[16px] font-black text-gray-01"
                      numberOfLines={1}
                    >
                      {place.name}
                    </Text>
                    {place.category ? (
                      <Text className="text-[11px] font-medium text-gray-02">
                        {place.category}
                      </Text>
                    ) : null}
                  </View>
                  <Text
                    className="mt-[6px] text-[12px] leading-4 text-gray-02"
                    numberOfLines={2}
                  >
                    {getPlaceDescription(place)}
                  </Text>
                  <View className="mt-[8px] flex-row gap-[10px]">
                    {place.category ? (
                      <Tag title={place.category} tone="orange" />
                    ) : null}
                    {place.stay_minutes ? (
                      <Tag title={`${place.stay_minutes}분`} tone="orange" />
                    ) : null}
                  </View>
                </View>

                <View className="ml-[12px] h-[38px] w-[38px] rounded-[12px] bg-[#EFEFEB]" />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-background px-6 pb-6 pt-3">
        <Pressable className="h-[48px] items-center justify-center rounded-[14px] bg-main-green">
          <Text className="text-[15px] font-bold text-white">
            이 동선 저장하기
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
