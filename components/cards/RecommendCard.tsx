import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import Button from "../buttons/Button";

type RecommendCardProps = {
  recommendation: IPostAIRecommendationResponse;
  onBookmarkPress?: () => void;
  onDislikePress?: () => void;
  onPlacePress?: (place: IPlaceItem) => void;
};

export default function RecommendCard({
  recommendation,
  onBookmarkPress,
  onDislikePress,
  onPlacePress,
}: RecommendCardProps) {
  const places = useMemo(() => {
    return [...recommendation.places].sort(
      (prev, next) => prev.visit_order - next.visit_order,
    );
  }, [recommendation.places]);

  return (
    <View className="h-fit w-[360px] items-center gap-[14px] rounded-[24px] border border-gray-04 bg-background p-[20px] shadow-sm">
      <View className="w-full gap-[8px]">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text
              className="text-[24px] font-bold text-gray-01"
              numberOfLines={2}
            >
              {recommendation.title}
            </Text>
            <View className="mt-2 flex-row items-center gap-[4px]">
              <MaterialCommunityIcons
                name="clock-outline"
                size={20}
                color="#F29B7F"
              />
              <Text className="text-[18px] font-medium text-gray-01">
                {recommendation.estimated_time}
              </Text>
            </View>
          </View>
          <View className="h-11 w-11 items-center justify-center rounded-full bg-main-light-orange">
            <MaterialCommunityIcons name="routes" size={28} color="#7D9AAE" />
          </View>
        </View>
        <Text className="text-[12px] text-gray-02">
          AI가 선택한 {places.length}개 장소를 순서대로 방문하는 추천 동선
        </Text>
      </View>

      <View className="w-full gap-[10px] rounded-[16px] bg-main-light-orange p-[14px]">
        {places.map((place, index) => {
          const isLast = index === places.length - 1;

          return (
            <Pressable
              key={`${place.visit_order}-${place.name}`}
              className="flex-row gap-[10px]"
              disabled={!onPlacePress}
              onPress={() => onPlacePress?.(place)}
            >
              <View className="items-center">
                <View className="h-[26px] w-[26px] items-center justify-center rounded-full bg-main-green">
                  <Text className="text-[12px] font-bold text-white">
                    {place.visit_order}
                  </Text>
                </View>
                {!isLast ? (
                  <View className="min-h-[42px] w-[2px] flex-1 bg-main-green" />
                ) : null}
              </View>
              <View className="flex-1 pb-[10px]">
                <Text
                  className="text-[15px] font-bold text-gray-01"
                  numberOfLines={1}
                >
                  {place.name}
                </Text>
                <View className="mt-[3px] flex-row items-start gap-[3px]">
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={14}
                    color="#F29B7F"
                  />
                  <Text className="flex-1 text-[12px] text-gray-02">
                    {place.address}
                  </Text>
                </View>
                <Text className="mt-[4px] text-[12px] leading-4 text-gray-02">
                  {place.description}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View className="flex-row items-center">
        <Button
          title="맘에 들어요"
          size="small"
          color="gradient"
          onPress={() => {
            onDislikePress?.();
          }}
        />
        <Button
          title="별로예요"
          size="small"
          color="disabled"
          onPress={() => {
            onDislikePress?.();
          }}
        />
      </View>
    </View>
  );
}
