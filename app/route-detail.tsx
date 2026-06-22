import getAIRecommendation from "@/api/ai/getAIRecommendation";
import getRoute from "@/api/routes/getRoute";
import getRouteTransportation from "@/api/routes/getRouteTransportation";
import postRouteFromRecommendation from "@/api/routes/postRouteFromRecommendation";
import Tag from "@/components/cards/Tag";
import { useAuthStore } from "@/store/login/useAuthStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import type { WebView as WebViewType } from "react-native-webview";

const KAKAO_MAP_BASE_URL =
  process.env.EXPO_PUBLIC_KAKAO_MAP_URL ??
  "https://capstone-kakao-map.vercel.app/";

const getPlaceOrder = (place: IPlaceItem) =>
  place.order ?? place.visit_order ?? 0;

const getPlaceDescription = (place: IPlaceItem) =>
  place.reason ??
  place.description ??
  place.place_story ??
  "방문하기 좋은 추천 장소입니다.";

const formatDate = (date?: string) => {
  if (!date) {
    return null;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\.$/, "");
};

const formatCostRange = (min?: number, max?: number) => {
  if (typeof min !== "number" || typeof max !== "number") {
    return null;
  }

  return `${min.toLocaleString("ko-KR")}~${max.toLocaleString("ko-KR")}원`;
};

const formatMinutes = (minutes?: number) => {
  if (typeof minutes !== "number") {
    return null;
  }

  if (minutes < 60) {
    return `${minutes}분`;
  }

  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;

  return restMinutes ? `${hours}시간 ${restMinutes}분` : `${hours}시간`;
};

const compactUniqueStrings = (values: (string | null | undefined)[]) => {
  const seen = new Set<string>();

  return values.reduce<string[]>((result, value) => {
    const trimmedValue = value?.trim();

    if (!trimmedValue || seen.has(trimmedValue)) {
      return result;
    }

    seen.add(trimmedValue);
    return [...result, trimmedValue];
  }, []);
};

const getRotatingTagTone = (index: number): "green" | "orange" | "blue" => {
  const tones = ["green", "orange", "blue"] as const;

  return tones[index % tones.length];
};

const filterVisibleScoreReasons = (scoreReasons?: string[]) =>
  scoreReasons?.filter((reason) => {
    const normalizedReason = reason.toLowerCase();

    return (
      !normalizedReason.includes("theme_match") &&
      !normalizedReason.includes("transport_match")
    );
  }) ?? [];

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) {
    return null;
  }

  return (
    <View className="flex-row items-start justify-between gap-[14px]">
      <Text className="text-[12px] font-bold text-gray-03">{label}</Text>
      <Text className="min-w-0 flex-1 text-right text-[13px] font-bold text-gray-01">
        {value}
      </Text>
    </View>
  );
}

function SummaryBadge({ title }: { title: string }) {
  return (
    <View className="rounded-[12px] border border-[#DCEAD7] bg-[#F7FAF5] px-[12px] py-[8px]">
      <Text className="text-[12px] font-bold text-main-green">{title}</Text>
    </View>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <View className="rounded-[20px] border border-gray-04/70 bg-white px-[20px] py-[18px]">
      {children}
    </View>
  );
}

function SectionHeader({
  icon,
  title,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
}) {
  return (
    <View className="flex-row items-center gap-[8px]">
      <View className="h-[28px] w-[28px] items-center justify-center rounded-full bg-[#EEF4EA]">
        <MaterialCommunityIcons name={icon} size={16} color="#739E6B" />
      </View>
      <Text className="text-[17px] font-black text-gray-01">{title}</Text>
    </View>
  );
}

const getTransportationItems = (
  transportation?: IGetRouteTransportationResponse,
) => {
  if (!transportation) {
    return [];
  }

  const knownItems =
    transportation.items ??
    transportation.segments ??
    transportation.routes ??
    transportation.details;

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

const getTotalPaymentText = (
  transportation?: IGetRouteTransportationResponse,
  items: IRouteTransportationItem[] = [],
) => {
  const explicitPaymentText =
    transportation?.totalPaymentText ?? transportation?.totalFareText;

  if (explicitPaymentText) {
    return explicitPaymentText;
  }

  const explicitPayment =
    transportation?.totalPayment ?? transportation?.totalFare;

  if (typeof explicitPayment === "number") {
    return formatPayment(explicitPayment);
  }

  const totalPayment = items.reduce(
    (sum, item) => sum + (typeof item.payment === "number" ? item.payment : 0),
    0,
  );

  return totalPayment > 0 ? formatPayment(totalPayment) : null;
};

const getSegmentDistanceText = (item: IRouteTransportationItem) =>
  item.distance ||
  item.distanceText ||
  item.distance_text ||
  item.distanceFromPreviousText ||
  item.distance_from_previous_text ||
  null;

const getSegmentTimeText = (item: IRouteTransportationItem) =>
  item.transferTimeText ||
  item.travelTimeText ||
  item.moveTimeText ||
  item.durationText ||
  item.timeText ||
  null;

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
  const insets = useSafeAreaInsets();
  const totalPaymentText = getTotalPaymentText(transportation, items);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/35">
        <Pressable className="flex-1" onPress={onClose} />
        <View
          className="h-[80%] rounded-t-[28px] bg-background shadow-xl"
          style={{ paddingBottom: insets.bottom || 24 }}
        >
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
              ) : transportation?.available === false && items.length === 0 ? (
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

                    {transportation?.totalTimeText || totalPaymentText ? (
                      <View className="gap-[6px]">
                        {transportation?.totalTimeText ? (
                          <View className="rounded-[14px] bg-[#EEF4EA] px-[12px] py-[8px]">
                            <Text className="text-[11px] font-bold text-gray-03">
                              총 시간
                            </Text>
                            <Text className="mt-[2px] text-[12px] font-black text-main-green">
                              {transportation.totalTimeText}
                            </Text>
                          </View>
                        ) : null}
                        {totalPaymentText ? (
                          <View className="rounded-[14px] bg-[#FFF8F3] px-[12px] py-[8px]">
                            <Text className="text-[11px] font-bold text-gray-03">
                              총 요금
                            </Text>
                            <Text className="mt-[2px] text-[12px] font-black text-main-orange">
                              {totalPaymentText}
                            </Text>
                          </View>
                        ) : null}
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
                        const distanceText = getSegmentDistanceText(item);
                        const timeText = getSegmentTimeText(item);

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

                            {distanceText || timeText ? (
                              <View className="mt-[12px] flex-row gap-[8px]">
                                {distanceText ? (
                                  <View className="min-w-0 flex-1 rounded-[14px] bg-[#F7F3EF] px-[12px] py-[10px]">
                                    <View className="flex-row items-center">
                                      <MaterialCommunityIcons
                                        name="map-marker-distance"
                                        size={16}
                                        color="#739E6B"
                                      />
                                      <Text className="ml-[5px] text-[11px] font-bold text-gray-03">
                                        장소간 거리
                                      </Text>
                                    </View>
                                    <Text
                                      className="mt-[4px] text-[13px] font-black text-gray-01"
                                      numberOfLines={1}
                                    >
                                      {distanceText}
                                    </Text>
                                  </View>
                                ) : null}

                                {timeText ? (
                                  <View className="min-w-0 flex-1 rounded-[14px] bg-[#F7F3EF] px-[12px] py-[10px]">
                                    <View className="flex-row items-center">
                                      <MaterialCommunityIcons
                                        name="clock-outline"
                                        size={16}
                                        color="#F08057"
                                      />
                                      <Text className="ml-[5px] text-[11px] font-bold text-gray-03">
                                        이동 시간
                                      </Text>
                                    </View>
                                    <Text
                                      className="mt-[4px] text-[13px] font-black text-gray-01"
                                      numberOfLines={1}
                                    >
                                      {timeText}
                                    </Text>
                                  </View>
                                ) : null}
                              </View>
                            ) : null}

                            <View className="mt-[12px] flex-row flex-wrap gap-[8px]">
                              {item.transport ? (
                                <Tag title={item.transport} tone="blue" />
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

type RouteMapModalProps = {
  onClose: () => void;
  places: IPlaceItem[];
  title?: string;
  visible: boolean;
};

function RouteMapModal({ onClose, places, title, visible }: RouteMapModalProps) {
  const insets = useSafeAreaInsets();
  const webViewRef = React.useRef<WebViewType | null>(null);

  const postRouteToMap = React.useCallback(() => {
    const routePlaces = places
      .map((place, index) => {
        const latitude = Number(place.lat);
        const longitude = Number(place.lng);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          return null;
        }

        return {
          address: place.address,
          category: place.category,
          id: place.place_id ?? `${place.name}-${index}`,
          latitude,
          longitude,
          name: place.name,
          order: getPlaceOrder(place) || index + 1,
          place_id: place.place_id,
          type: "route",
        };
      })
      .filter((place): place is NonNullable<typeof place> => Boolean(place));

    const message = JSON.stringify({
      payload: {
        route: {
          places: routePlaces,
          title,
        },
      },
      type: "TRIPICK_MAP_DATA",
    });

    const script = `
      window.dispatchEvent(new MessageEvent('message', { data: ${JSON.stringify(message)} }));
      true;
    `;

    webViewRef.current?.injectJavaScript(script);
    setTimeout(() => webViewRef.current?.injectJavaScript(script), 400);
    setTimeout(() => webViewRef.current?.injectJavaScript(script), 1200);
  }, [places, title]);

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background">
        <View
          className="flex-row items-center justify-between border-b border-gray-04 bg-background px-5 pb-3"
          style={{ paddingTop: insets.top + 10 }}
        >
          <View className="min-w-0 flex-1 pr-3">
            <Text className="text-[18px] font-black text-gray-01" numberOfLines={1}>
              지도에서 동선 보기
            </Text>
            <Text className="mt-1 text-[12px] text-gray-02" numberOfLines={1}>
              {title ?? "추천 동선"}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            className="h-10 w-10 items-center justify-center rounded-full bg-white"
            onPress={onClose}
          >
            <MaterialCommunityIcons name="close" size={22} color="#3A3A3A" />
          </Pressable>
        </View>
        <WebView
          ref={webViewRef}
          className="flex-1"
          domStorageEnabled
          geolocationEnabled
          javaScriptEnabled
          onLoadEnd={postRouteToMap}
          originWhitelist={["*"]}
          source={{ uri: `${KAKAO_MAP_BASE_URL}?mode=route` }}
          startInLoadingState
        />
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
  const [isRouteMapVisible, setIsRouteMapVisible] = useState(false);
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
  const card = route?.card;
  const regionLabel =
    card?.region_label ?? [route?.sido, route?.sigungu].filter(Boolean).join(" ");
  const createdDate = formatDate(route?.created_at);
  const savedDate = formatDate(route?.saved_at);
  const headlineText =
    route?.subtitle ??
    card?.summary ??
    route?.description ??
    route?.total_distance_text ??
    route?.estimated_time ??
    "AI가 고른 장소 순서대로 이어지는 추천 코스";
  const summaryMetrics = compactUniqueStrings([
    route?.summary?.contribution_label,
    card?.estimated_duration_text,
    route?.summary?.duration_text,
    card?.estimated_cost_text,
    route?.summary?.cost_range_text,
    card?.local_consumption_text,
    route?.summary?.local_consumption_text,
    ...(card?.metric_badges ?? []),
    typeof route?.contribution_score === "number"
      ? `지역 기여 ${route.contribution_score}점`
      : null,
  ]);
  const summaryDescription =
    route?.ai_reason_detail?.overview ??
    card?.ai_reason_summary ??
    route?.ai_reason ??
    headlineText;
  const reasonDetail = route?.ai_reason_detail;
  const placeCount = route?.place_count ?? places.length;
  const routeImageUrl = route?.image_url ?? card?.thumbnail_url ?? places[0]?.image_url;
  const topTags = compactUniqueStrings([
    regionLabel,
    route?.theme_label ?? card?.theme_label,
    placeCount ? `장소 ${placeCount}곳` : null,
    route?.mobility?.label ??
      route?.transport_label ??
      route?.mobility?.recommended_transport,
  ]);
  const routeTags = compactUniqueStrings([
    ...(route?.route_badges ?? []),
    ...(route?.tags ?? []),
    ...(card?.tags ?? []),
  ]).filter((tag) => !topTags.includes(tag));
  const getLegAfterPlace = (place: IPlaceItem, index: number) => {
    const nextPlace = places[index + 1];

    if (!nextPlace) {
      return null;
    }

    const routeLeg =
      route?.route_legs?.find((leg) => leg.order === index + 1) ??
      route?.route_legs?.find(
        (leg) =>
          leg.from_place_id === place.place_id &&
          leg.to_place_id === nextPlace.place_id,
      );

    if (routeLeg) {
      return {
        distanceText: routeLeg.distance_text,
        fromName: routeLeg.from_name,
        toName: routeLeg.to_name,
      };
    }

    if (nextPlace.distance_from_previous_text) {
      return {
        distanceText: nextPlace.distance_from_previous_text,
        fromName: place.name,
        toName: nextPlace.name,
      };
    }

    return null;
  };
  const overviewRows = [
    {
      label: "지역",
      value: regionLabel || route?.region?.sigungu,
    },
    {
      label: "테마",
      value: route?.theme_label ?? card?.theme_label,
    },
    {
      label: "장소",
      value: placeCount ? `${placeCount}곳` : null,
    },
    {
      label: "여행 시간",
      value:
        route?.travel_time_label ??
        card?.estimated_duration_text ??
        route?.estimated_time ??
        formatMinutes(route?.estimated_duration_minutes),
    },
    {
      label: "이동 수단",
      value: route?.transport_label ?? route?.mobility?.recommended_transport,
    },
    {
      label: "동행",
      value: route?.companion_label,
    },
    {
      label: "총 거리",
      value: route?.total_distance_text ?? card?.route_preview_text,
    },
    {
      label: "예상 체류",
      value: formatMinutes(route?.total_stay_minutes),
    },
    {
      label: "예상 비용",
      value:
        route?.summary?.cost_range_text ??
        card?.estimated_cost_text ??
        formatCostRange(route?.estimated_cost_min, route?.estimated_cost_max),
    },
    {
      label: "지역 소비",
      value:
        route?.summary?.local_consumption_text ??
        card?.local_consumption_text ??
        (route?.local_consumption_count
          ? `${route.local_consumption_count}곳 포함`
          : null),
    },
    {
      label: "저장일",
      value: savedDate ?? createdDate,
    },
  ];

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
        contentContainerClassName="px-5 pb-[168px] pt-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-[22px]">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 gap-[8px]">
              <Text className="text-[26px] font-black text-gray-01">
                동선 상세
              </Text>
              <Text className="text-[14px] font-medium text-gray-02">
                장소 순서와 추천 이유를 한눈에 확인해요
              </Text>
            </View>
            {createdDate ? (
              <View className="mt-1 rounded-full border border-gray-04 bg-white px-3 py-[6px]">
                <Text className="text-[11px] font-bold text-gray-02">
                  {createdDate}
                </Text>
              </View>
            ) : null}
          </View>

          <View className="overflow-hidden rounded-[24px] border border-gray-04/70 bg-white">
            <View className="h-[188px] w-full bg-[#EEF4EA]">
              {routeImageUrl ? (
                <ExpoImage
                  source={{ uri: routeImageUrl }}
                  contentFit="cover"
                  style={{ height: "100%", width: "100%" }}
                />
              ) : (
                <View className="h-full w-full items-center justify-center">
                  <MaterialCommunityIcons
                    name="map-marker-path"
                    size={36}
                    color="#739E6B"
                  />
                </View>
              )}
            </View>

            <View className="px-5 py-[22px]">
              <Text
                className="text-[25px] font-black leading-[32px] text-gray-01"
                numberOfLines={2}
              >
                {route.title}
              </Text>
              <Text className="mt-[8px] text-[13px] font-medium leading-5 text-gray-02">
                {headlineText}
              </Text>

              {topTags.length ? (
                <View className="mt-[18px] flex-row flex-wrap gap-[8px]">
                  {topTags.slice(0, 4).map((tag, index) => (
                    <Tag
                      key={tag}
                      title={tag}
                      tone={
                        index === 1 ? "orange" : index === 2 ? "blue" : "green"
                      }
                      variant="soft"
                      size="medium"
                    />
                  ))}
                </View>
              ) : null}
            </View>
          </View>

          {routeTags.length ? (
            <SectionCard>
              <SectionHeader icon="tag-multiple-outline" title="동선 태그" />
              <View className="mt-[12px] flex-row flex-wrap gap-[8px]">
                {routeTags.slice(0, 8).map((tag, index) => (
                  <Tag
                    key={tag}
                    title={tag}
                    tone={getRotatingTagTone(index)}
                    variant="soft"
                  />
                ))}
              </View>
            </SectionCard>
          ) : null}

          <SectionCard>
            <SectionHeader icon="clipboard-text-outline" title="동선 요약" />
            <Text className="mt-[10px] text-[13px] leading-5 text-gray-02">
              {summaryDescription}
            </Text>
            {summaryMetrics.length ? (
              <View className="mt-[12px] flex-row flex-wrap gap-[8px]">
                {summaryMetrics.slice(0, 6).map((metric) => (
                  <SummaryBadge key={metric} title={metric} />
                ))}
              </View>
            ) : null}
            <View className="mt-[14px] gap-[10px]">
              {overviewRows.map((row) => (
                <InfoRow key={row.label} label={row.label} value={row.value} />
              ))}
            </View>
            {route.contribution_info ? (
              <View className="mt-[16px] rounded-[16px] bg-[#F7FAF5] px-[14px] py-[12px]">
                <View className="flex-row items-center justify-between gap-[10px]">
                  <Text className="text-[13px] font-black text-main-green">
                    {route.contribution_info.label}
                  </Text>
                  <Text className="text-[13px] font-black text-main-orange">
                    {route.contribution_info.score}점
                  </Text>
                </View>
                <Text className="mt-[6px] text-[12px] leading-5 text-gray-02">
                  {route.contribution_info.description}
                </Text>
              </View>
            ) : null}
          </SectionCard>

          <SectionCard>
            <SectionHeader icon="star-four-points-outline" title="AI 추천 이유" />
            <Text className="mt-[10px] text-[13px] leading-5 text-gray-02">
              {route.ai_reason ??
                route.description ??
                "방문하기 좋은 장소를 순서대로 구성했어요."}
            </Text>
            {reasonDetail ? (
              <View className="mt-[14px] gap-[10px]">
                {reasonDetail.highlights?.length ? (
                  <View className="flex-row flex-wrap gap-[8px]">
                    {reasonDetail.highlights.slice(0, 4).map((highlight) => (
                      <Tag key={highlight} title={highlight} tone="green" />
                    ))}
                  </View>
                ) : null}
                {[
                  reasonDetail.route_design,
                  reasonDetail.local_contribution,
                  reasonDetail.traveler_fit,
                  reasonDetail.closing_tip,
                ]
                  .filter(Boolean)
                  .map((text) => (
                    <View
                      key={text}
                      className="rounded-[14px] bg-[#FAFAFA] px-[13px] py-[10px]"
                    >
                      <Text className="text-[12px] leading-5 text-gray-02">
                        {text}
                      </Text>
                    </View>
                  ))}
              </View>
            ) : null}
          </SectionCard>

          {route.region_story ? (
            <SectionCard>
              <SectionHeader
                icon="map-marker-radius-outline"
                title={route.region_story.title}
              />
              <Text className="mt-[8px] text-[13px] leading-5 text-gray-02">
                {route.region_story.summary}
              </Text>
              <Text className="mt-[8px] text-[12px] leading-5 text-gray-02">
                {route.region_story.history}
              </Text>
              <Text className="mt-[8px] text-[12px] leading-5 text-gray-02">
                {route.region_story.local_story}
              </Text>
              <Text className="mt-[8px] text-[12px] leading-5 text-gray-02">
                {route.region_story.local_tip}
              </Text>
            </SectionCard>
          ) : null}

          {route.local_consumption_points?.length ? (
            <SectionCard>
              <SectionHeader
                icon="storefront-outline"
                title="지역 소비 포인트"
              />
              <Text className="mt-[8px] text-[12px] leading-5 text-gray-02">
                지역 가게와 체험을 자연스럽게 들를 수 있는 지점을 모았어요.
              </Text>
              <View className="mt-[14px] gap-[10px]">
                {route.local_consumption_points.map((point, index) => (
                  <View
                    key={`${point.place_id ?? point.place_name ?? point.name}-${index}`}
                    className="flex-row rounded-[16px] border border-[#F3DDCF] bg-[#FFF8F3] px-[14px] py-[12px]"
                  >
                    <View className="h-[26px] w-[26px] items-center justify-center rounded-full bg-main-orange">
                      <Text className="text-[11px] font-black text-white">
                        {index + 1}
                      </Text>
                    </View>
                    <View className="ml-[10px] min-w-0 flex-1">
                      <Text
                        className="text-[13px] font-black text-main-orange"
                        numberOfLines={1}
                      >
                        {point.place_name ?? point.name ?? "추천 장소"}
                      </Text>
                      <Text className="mt-[5px] text-[12px] leading-5 text-gray-02">
                        {point.reason}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </SectionCard>
          ) : null}

          <View className="gap-[12px]">
            <SectionHeader icon="map-marker-path" title="방문 순서" />
            {places.map((place, index) => {
              const nextLeg = getLegAfterPlace(place, index);
              const visibleScoreReasons = filterVisibleScoreReasons(
                place.score_reasons,
              );

              return (
                <View key={place.place_id ?? `${place.name}-${index}`}>
                  <View
                    className="min-h-[96px] flex-row items-start rounded-[18px] border border-gray-04/70 bg-white px-[14px] py-[14px]"
                  >
                    <View className="mt-[2px] h-[32px] w-[32px] items-center justify-center rounded-full bg-main-green">
                      <Text className="text-[15px] font-bold text-white">
                        {getPlaceOrder(place) || index + 1}
                      </Text>
                    </View>

                    <View className="ml-[12px] min-w-0 flex-1">
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
                        numberOfLines={3}
                      >
                        {getPlaceDescription(place)}
                      </Text>
                      {place.contribution_reason || place.local_tip ? (
                        <Text
                          className="mt-[6px] text-[12px] leading-4 text-main-green"
                          numberOfLines={2}
                        >
                          {place.contribution_reason ?? place.local_tip}
                        </Text>
                      ) : null}
                      <View className="mt-[8px] flex-row flex-wrap gap-[8px]">
                        {place.category ? (
                          <Tag title={place.category} tone="orange" />
                        ) : null}
                        {place.stay_minutes ? (
                          <Tag title={`${place.stay_minutes}분`} tone="orange" />
                        ) : null}
                        {typeof place.recommendation_score === "number" ? (
                          <Tag
                            title={`${place.recommendation_score}점`}
                            tone="green"
                          />
                        ) : null}
                      </View>
                      {visibleScoreReasons.length ? (
                        <Text
                          className="mt-[6px] text-[11px] leading-4 text-gray-03"
                          numberOfLines={2}
                        >
                          {visibleScoreReasons.slice(0, 2).join(" · ")}
                        </Text>
                      ) : null}
                      {place.tags?.length ? (
                        <View className="mt-[7px] flex-row flex-wrap gap-[6px]">
                          {place.tags.slice(0, 3).map((tag, tagIndex) => (
                            <Tag
                              key={tag}
                              title={tag}
                              tone={getRotatingTagTone(tagIndex)}
                            />
                          ))}
                        </View>
                      ) : null}
                    </View>
                  </View>

                  {nextLeg ? (
                    <View className="mx-[18px] flex-row items-center py-[8px]">
                      <View className="mr-[10px] h-[28px] w-[28px] items-center justify-center rounded-full bg-[#EEF4EA]">
                        <MaterialCommunityIcons
                          name="arrow-down"
                          size={16}
                          color="#739E6B"
                        />
                      </View>
                      <View className="min-w-0 flex-1 flex-row items-center rounded-[14px] bg-[#F7FAF5] px-[12px] py-[9px]">
                        <Text
                          className="min-w-0 flex-1 text-[12px] font-medium text-gray-02"
                          numberOfLines={1}
                        >
                          {nextLeg.fromName} → {nextLeg.toName}
                        </Text>
                        <Text className="ml-[10px] text-[12px] font-black text-main-green">
                          {nextLeg.distanceText}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 gap-2 border-t border-gray-04/70 bg-background px-5 pb-6 pt-3">
        <Pressable
          className="h-[48px] flex-row items-center justify-center rounded-[14px] bg-main-orange"
          onPress={() => setIsRouteMapVisible(true)}
        >
          <MaterialCommunityIcons name="map-marker-path" size={20} color="#FFFFFF" />
          <Text className="ml-[8px] text-[15px] font-bold text-white">
            지도에서 동선 보기
          </Text>
        </Pressable>
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
      <RouteMapModal
        onClose={() => setIsRouteMapVisible(false)}
        places={places}
        title={route.title}
        visible={isRouteMapVisible}
      />
    </View>
  );
}
