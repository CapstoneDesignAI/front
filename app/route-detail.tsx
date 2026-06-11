import getAIRecommendation from "@/api/ai/getAIRecommendation";
import getRoute from "@/api/routes/getRoute";
import getRouteTransportation from "@/api/routes/getRouteTransportation";
import postRouteFromRecommendation from "@/api/routes/postRouteFromRecommendation";
import Tag from "@/components/cards/Tag";
import { useAuthStore } from "@/store/login/useAuthStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

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
    source?: "home" | "ai" | "saved";
  }>();
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  const [isTransportationSheetVisible, setIsTransportationSheetVisible] =
    useState(false);
  const isSavedRouteDetail = source === "saved";
  const routeId = id ?? "";

  const {
    data: route,
    isError: isRouteError,
    isLoading: isRouteLoading,
  } = useQuery({
    queryKey: [
      isSavedRouteDetail ? "SAVED_ROUTE_DETAIL" : "AI_RECOMMENDATION_DETAIL",
      routeId,
      accessToken,
    ],
    queryFn: () =>
      isSavedRouteDetail
        ? getRoute(accessToken, routeId)
        : getAIRecommendation(accessToken, routeId),
    enabled: Boolean(routeId) && Boolean(accessToken),
    retry: false,
  });

  const { mutate: saveRoute, isPending: isSaveRoutePending } = useMutation({
    mutationFn: () => postRouteFromRecommendation(accessToken, routeId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["SAVED_ROUTES"] });
      Alert.alert("저장 완료", "내 동선에서 다시 볼 수 있어요.");
    },
    onError: (error) => {
      Alert.alert(
        "저장 실패",
        error instanceof Error ? error.message : "동선을 저장하지 못했어요.",
      );
    },
  });

  const places = useMemo(() => {
    return [...(route?.places ?? [])].sort(
      (prev, next) => getPlaceOrder(prev) - getPlaceOrder(next),
    );
  }, [route?.places]);

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

  if (!accessToken) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-[18px] font-black text-gray-01">
          로그인이 필요해요
        </Text>
        <Text className="mt-2 text-center text-[13px] leading-5 text-gray-02">
          동선 상세를 보려면 다시 로그인해 주세요.
        </Text>
      </View>
    );
  }

  if (isRouteLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#739E6B" />
        <Text className="mt-3 text-[13px] font-medium text-gray-02">
          동선 상세를 불러오는 중이에요
        </Text>
      </View>
    );
  }

  if (isRouteError || !route) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-[18px] font-black text-gray-01">
          동선을 불러오지 못했어요
        </Text>
        <Text className="mt-2 text-center text-[13px] leading-5 text-gray-02">
          목록에서 다시 상세 보기를 눌러 주세요.
        </Text>
      </View>
    );
  }

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
              {route.total_distance_text ??
                route.estimated_time ??
                "AI가 고른 장소 순서대로 이어지는 추천 코스"}
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
              {route.ai_reason ?? "방문하기 좋은 장소를 순서대로 구성했어요."}
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
          <Pressable
            className={`h-[48px] items-center justify-center rounded-[14px] ${
              isSaveRoutePending ? "bg-gray-03" : "bg-main-green"
            }`}
            disabled={isSaveRoutePending}
            onPress={() => saveRoute()}
          >
            <Text className="text-[15px] font-bold text-white">
              {isSaveRoutePending ? "저장 중" : "이 동선 저장하기"}
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
