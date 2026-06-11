import { Image as ExpoImage } from "expo-image";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import Tag from "./Tag";

type RecommendCardProps = {
  recommendation?: IPostAIRecommendationResponse | null;
  onSavePress?: () => void;
  source?: "home" | "ai" | "saved";
};

const getPlaceOrder = (place: IPlaceItem) =>
  place.order ?? place.visit_order ?? 0;

export default function RecommendCard({
  recommendation,
  onSavePress,
  source = "home",
}: RecommendCardProps) {
  const safeRecommendation = recommendation ?? {
    title: "추천 동선",
    places: [],
  };
  const card = safeRecommendation.card;
  const places = useMemo(() => {
    return [...(safeRecommendation.places ?? [])].sort(
      (prev, next) => getPlaceOrder(prev) - getPlaceOrder(next),
    );
  }, [safeRecommendation.places]);

  const firstPlaceName = places[0]?.name;
  const lastPlaceName = places[places.length - 1]?.name;
  const fallbackRouteDescription =
    firstPlaceName && lastPlaceName
      ? `${firstPlaceName}부터 ${lastPlaceName}까지 이어지는 로컬 동선`
      : (safeRecommendation.ai_reason ??
        "AI가 고른 장소 순서대로 이어지는 추천 동선");
  const routeDescription =
    card?.summary ??
    card?.ai_reason_summary ??
    safeRecommendation.subtitle ??
    safeRecommendation.ai_reason_detail?.overview ??
    fallbackRouteDescription;
  const routeSummary =
    card?.route_preview_text ??
    card?.place_preview_names?.slice(0, 4).join(" → ") ??
    places
      .map((place) => place.name)
      .slice(0, 4)
      .join(" → ");
  const routeId = safeRecommendation.route_id ?? safeRecommendation.title;
  const thumbnailUrl = card?.thumbnail_url ?? places[0]?.image_url;
  const regionLabel =
    card?.region_label ??
    [safeRecommendation.sido, safeRecommendation.sigungu]
      .filter(Boolean)
      .join(" ");
  const themeLabel = card?.theme_label ?? safeRecommendation.theme_label;
  const transportLabel =
    card?.mobility?.recommended_transport ??
    safeRecommendation.mobility?.recommended_transport ??
    safeRecommendation.transport_label;
  const contributionScore =
    card?.contribution_score ?? safeRecommendation.contribution_score;
  const metrics = [
    card?.estimated_duration_text ?? safeRecommendation.summary?.duration_text,
    card?.estimated_cost_text ?? safeRecommendation.summary?.cost_range_text,
    card?.local_consumption_text ??
      safeRecommendation.summary?.local_consumption_text,
  ].filter((metric): metric is string => Boolean(metric));

  const handleViewRoute = () => {
    router.push({
      pathname: "/route-detail",
      params: { id: routeId, source },
    });
  };

  return (
    <View className="w-full gap-[22px] rounded-[24px] border border-gray-04 bg-white px-[18px] pb-[18px] pt-[18px] shadow-sm">
      <View className="relative h-[98px] w-full overflow-hidden rounded-[20px] bg-[#D6E8F0]">
        {thumbnailUrl ? (
          <ExpoImage
            source={{ uri: thumbnailUrl }}
            contentFit="cover"
            style={{ height: "100%", width: "100%" }}
          />
        ) : (
          <>
            <View className="absolute bottom-[-34px] left-[18px] h-[86px] w-[86px] rounded-full bg-white/25" />
            <View className="absolute bottom-[-46px] right-[34px] h-[118px] w-[118px] rounded-full bg-white/20" />
          </>
        )}
        <View className="absolute bottom-[14px] left-[14px] flex-row rounded-full bg-white/90 px-[12px] py-[6px]">
          <Text className="text-[11px] font-bold text-main-green">
            {regionLabel || "추천 지역"}
          </Text>
        </View>
        {onSavePress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="동선 저장"
            className="absolute right-[22px] top-[20px] h-[32px] w-[32px] rounded-full bg-white"
            onPress={onSavePress}
          />
        ) : null}
      </View>

      <View className="gap-[12px]">
        <View className="flex-row flex-wrap gap-[8px]">
          {themeLabel ? (
            <Tag title={themeLabel} tone="green" variant="soft" size="medium" />
          ) : null}
          {transportLabel ? (
            <Tag
              title={transportLabel}
              tone="blue"
              variant="soft"
              size="medium"
            />
          ) : null}
          {typeof contributionScore === "number" ? (
            <Tag
              title={`기여 ${contributionScore}점`}
              tone="orange"
              variant="soft"
              size="medium"
            />
          ) : null}
        </View>

        <View className="gap-[8px]">
          <Text
            className="text-[24px] font-black text-gray-01"
            numberOfLines={1}
          >
            {safeRecommendation.title}
          </Text>
          <Text
            className="text-[13px] leading-5 text-gray-02"
            numberOfLines={2}
          >
            {routeDescription}
          </Text>
        </View>

        <View className="flex-row items-center gap-[22px]">
          <View className="rounded-[18px] border border-[#E8D6BA] bg-background px-[18px] py-[10px]">
            <Text className="text-[12px] font-bold text-main-green">
              {card?.place_count_text ??
                `장소 ${safeRecommendation.place_count ?? places.length}곳`}
            </Text>
          </View>
          <Text
            className="min-w-0 flex-1 text-[13px] font-medium text-gray-02"
            numberOfLines={1}
          >
            {routeSummary || "상세 보기에서 장소 정보를 확인해요"}
          </Text>
        </View>

        {metrics.length ? (
          <View className="flex-row flex-wrap gap-[8px]">
            {metrics.slice(0, 3).map((metric) => (
              <Tag key={metric} title={metric} tone="gray" variant="soft" />
            ))}
          </View>
        ) : null}
      </View>

      <View className="flex-row justify-between gap-[32px]">
        <Pressable
          accessibilityRole="button"
          className="h-[42px] flex-1 items-center justify-center rounded-[14px] bg-main-green"
          onPress={handleViewRoute}
        >
          <Text className="text-[15px] font-bold text-white">동선 보기</Text>
        </Pressable>
        {onSavePress ? (
          <Pressable
            accessibilityRole="button"
            className="h-[42px] flex-1 items-center justify-center rounded-[14px] bg-main-orange"
            onPress={onSavePress}
          >
            <Text className="text-[15px] font-bold text-white">저장</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
