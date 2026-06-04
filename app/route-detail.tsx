import getRouteTransportation from "@/api/routes/getRouteTransportation";
import Tag from "@/components/cards/Tag";
import { useAuthStore } from "@/store/login/useAuthStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const routeDetails: Record<string, IPostAIRecommendationResponse> = {
  "route-danyang-healing-half_day-walk-friends": {
    route_id: "route-danyang-healing-half_day-walk-friends",
    title: "단양 감성 뷰 코스",
    sido: "충청북도",
    sigungu: "단양군",
    theme_label: "힐링",
    contribution_score: 86,
    ai_reason: "짧은 이동 안에 전망, 산책, 로컬 소비를 균형 있게 배치했어요.",
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

const defaultRoute =
  routeDetails["route-danyang-healing-half_day-walk-friends"];

const getPlaceOrder = (place: IPlaceItem) =>
  place.order ?? place.visit_order ?? 0;

const getPlaceDescription = (place: IPlaceItem) =>
  place.reason ?? place.description ?? "방문하기 좋은 추천 장소입니다.";

const getTransportationItems = (
  transportation?: IGetRouteTransportationResponse,
) => {
  if (!transportation) {
    return [];
  }

  const knownItems =
    transportation.items ?? transportation.segments ?? transportation.routes;

  if (knownItems) {
    return knownItems;
  }

  const arrayValue = Object.values(transportation).find(
    (value): value is IRouteTransportationItem[] =>
      Array.isArray(value) &&
      value.every(
        (item) =>
          item &&
          typeof item === "object" &&
          "start" in item &&
          "arrival" in item,
      ),
  );

  return arrayValue ?? [];
};

const formatPayment = (payment?: number) => {
  if (typeof payment !== "number") {
    return null;
  }

  return `${payment.toLocaleString("ko-KR")}원`;
};

type TransportationBottomSheetProps = {
  hasAccessToken: boolean;
  isError: boolean;
  isLoading: boolean;
  items: IRouteTransportationItem[];
  onClose: () => void;
  transportation?: IGetRouteTransportationResponse;
  visible: boolean;
};

function TransportationBottomSheet({
  hasAccessToken,
  isError,
  isLoading,
  items,
  onClose,
  transportation,
  visible,
}: TransportationBottomSheetProps) {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/35">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="max-h-[78%] rounded-t-[28px] bg-background pb-6 shadow-xl">
          <View className="items-center pb-2 pt-[10px]">
            <View className="h-1 w-[42px] rounded-full bg-main-green" />
          </View>

          <View className="flex-row items-start justify-between px-6 pb-4">
            <View className="min-w-0 flex-1 pr-4">
              <Text className="text-[22px] font-black text-gray-01">
                교통 및 이동 동선 안내
              </Text>
              <Text className="mt-[6px] text-[13px] leading-5 text-gray-02">
                저장한 동선의 대중교통 이동 정보를 확인해요.
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              className="h-9 w-9 items-center justify-center rounded-full bg-white"
              onPress={onClose}
            >
              <MaterialCommunityIcons name="close" size={21} color="#3A3A3A" />
            </Pressable>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerClassName="px-6 pb-8"
            showsVerticalScrollIndicator={false}
          >
            <View className="rounded-[22px] border border-gray-04 bg-white px-[20px] py-[20px]">
              {!hasAccessToken ? (
                <View className="min-h-[148px] items-center justify-center">
                  <MaterialCommunityIcons
                    name="account-lock-outline"
                    size={30}
                    color="#A0A0A0"
                  />
                  <Text className="mt-[10px] text-[15px] font-bold text-gray-01">
                    로그인이 필요해요
                  </Text>
                  <Text className="mt-[8px] text-center text-[12px] leading-4 text-gray-02">
                    교통 안내를 확인하려면 다시 로그인해 주세요.
                  </Text>
                </View>
              ) : isLoading ? (
                <View className="min-h-[148px] items-center justify-center">
                  <ActivityIndicator color="#739E6B" />
                  <Text className="mt-[12px] text-[13px] font-medium text-gray-02">
                    교통 정보를 불러오는 중이에요
                  </Text>
                </View>
              ) : isError ? (
                <View className="min-h-[148px] items-center justify-center">
                  <Text className="text-[15px] font-bold text-gray-01">
                    교통 정보를 불러오지 못했어요
                  </Text>
                  <Text className="mt-[8px] text-center text-[12px] leading-4 text-gray-02">
                    잠시 후 다시 안내 버튼을 눌러 확인해 주세요.
                  </Text>
                </View>
              ) : transportation?.available === false ? (
                <View className="min-h-[148px] items-center justify-center">
                  <MaterialCommunityIcons
                    name="map-marker-off-outline"
                    size={28}
                    color="#A0A0A0"
                  />
                  <Text className="mt-[10px] text-[15px] font-bold text-gray-01">
                    이용 가능한 교통 안내가 없어요
                  </Text>
                </View>
              ) : (
                <View>
                  <View className="flex-row items-start justify-between gap-[12px]">
                    <View className="min-w-0 flex-1">
                      <Text className="text-[18px] font-black text-gray-01">
                        {transportation?.title ?? "교통 안내"}
                      </Text>
                      <Text className="mt-[8px] text-[13px] leading-5 text-gray-02">
                        {transportation?.summaryText ??
                          "이 동선에 맞는 이동 정보를 확인해요."}
                      </Text>
                    </View>

                    {transportation?.totalTimeText ? (
                      <View className="rounded-[14px] bg-[#EEF4EA] px-[12px] py-[8px]">
                        <Text className="text-[12px] font-bold text-main-green">
                          {transportation.totalTimeText}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {transportation?.firstStart || transportation?.lastArrival ? (
                    <View className="mt-[18px] flex-row items-center rounded-[16px] bg-[#FFF8F3] px-[14px] py-[12px]">
                      <Text
                        className="min-w-0 flex-1 text-[13px] font-bold text-gray-01"
                        numberOfLines={1}
                      >
                        {transportation.firstStart ?? "출발지"}
                      </Text>
                      <MaterialCommunityIcons
                        name="arrow-right"
                        size={18}
                        color="#739E6B"
                      />
                      <Text
                        className="min-w-0 flex-1 text-right text-[13px] font-bold text-gray-01"
                        numberOfLines={1}
                      >
                        {transportation.lastArrival ?? "도착지"}
                      </Text>
                    </View>
                  ) : null}

                  <View className="mt-[18px] gap-[12px]">
                    {items.length > 0 ? (
                      items.map((item, index) => {
                        const paymentText = formatPayment(item.payment);

                        return (
                          <View
                            key={`${item.start}-${item.arrival}-${index}`}
                            className="rounded-[18px] border border-gray-04 bg-white px-[16px] py-[14px]"
                          >
                            <View className="flex-row items-center">
                              <View className="h-[30px] w-[30px] items-center justify-center rounded-full bg-main-light-orange">
                                <Text className="text-[13px] font-bold text-main-green">
                                  {index + 1}
                                </Text>
                              </View>
                              <View className="ml-[12px] min-w-0 flex-1">
                                <Text
                                  className="text-[14px] font-black text-gray-01"
                                  numberOfLines={1}
                                >
                                  {item.start} → {item.arrival}
                                </Text>
                                {item.detailText ? (
                                  <Text className="mt-[6px] text-[12px] leading-4 text-gray-02">
                                    {item.detailText}
                                  </Text>
                                ) : null}
                              </View>
                            </View>

                            <View className="mt-[12px] flex-row flex-wrap gap-[8px]">
                              {item.transport ? (
                                <Tag title={item.transport} tone="blue" />
                              ) : null}
                              {item.transferTimeText ? (
                                <Tag
                                  title={item.transferTimeText}
                                  tone="orange"
                                />
                              ) : null}
                              {typeof item.transferCount === "number" ? (
                                <Tag
                                  title={`환승 ${item.transferCount}회`}
                                  tone="green"
                                />
                              ) : null}
                              {paymentText ? (
                                <Tag title={paymentText} tone="orange" />
                              ) : null}
                              {item.distance ? (
                                <Tag title={item.distance} tone="green" />
                              ) : null}
                            </View>
                          </View>
                        );
                      })
                    ) : (
                      <Text className="text-[13px] leading-5 text-gray-02">
                        상세 이동 구간 정보가 아직 준비되지 않았어요.
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function RouteDetailScreen() {
  const { id, source } = useLocalSearchParams<{
    id?: string;
    source?: "home" | "saved";
  }>();
  const { accessToken } = useAuthStore();
  const [isTransportationSheetVisible, setIsTransportationSheetVisible] =
    useState(false);
  const route = routeDetails[id ?? ""] ?? defaultRoute;
  const routeId = route.route_id ?? id ?? "";
  const isSavedRouteDetail = source === "saved";

  const places = useMemo(() => {
    return [...route.places].sort(
      (prev, next) => getPlaceOrder(prev) - getPlaceOrder(next),
    );
  }, [route.places]);

  const {
    data: transportation,
    isLoading: isTransportationLoading,
    isError: isTransportationError,
  } = useQuery({
    queryKey: ["ROUTE_TRANSPORTATION", routeId, accessToken],
    queryFn: () => getRouteTransportation(accessToken, routeId),
    enabled:
      isSavedRouteDetail &&
      isTransportationSheetVisible &&
      Boolean(routeId) &&
      Boolean(accessToken),
  });

  const transportationItems = getTransportationItems(transportation);

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
        {isSavedRouteDetail ? (
          <Pressable
            className="h-[48px] flex-row items-center justify-center rounded-[14px] bg-main-blue"
            onPress={() => setIsTransportationSheetVisible(true)}
          >
            <MaterialCommunityIcons name="bus-clock" size={20} color="#FFFFFF" />
            <Text className="ml-[8px] text-[15px] font-bold text-white">
              교통 및 이동 동선 안내
            </Text>
          </Pressable>
        ) : (
          <Pressable className="h-[48px] items-center justify-center rounded-[14px] bg-main-green">
            <Text className="text-[15px] font-bold text-white">
              이 동선 저장하기
            </Text>
          </Pressable>
        )}
      </View>

      <TransportationBottomSheet
        hasAccessToken={Boolean(accessToken)}
        isError={isTransportationError}
        isLoading={isTransportationLoading}
        items={transportationItems}
        onClose={() => setIsTransportationSheetVisible(false)}
        transportation={transportation}
        visible={isSavedRouteDetail && isTransportationSheetVisible}
      />
    </View>
  );
}
