import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

type StampCouponProps = {
  title?: string;
  completedCount?: number;
  totalCount?: number;
  rewardText?: string;
  buttonTitle?: string;
  onPress?: () => void;
};

const STAMP_TOTAL_COUNT = 10;

export default function StampCoupon({
  title = "단양 스탬프 쿠폰",
  completedCount = 8,
  totalCount = STAMP_TOTAL_COUNT,
  rewardText,
  buttonTitle = "미션 보기",
  onPress,
}: StampCouponProps) {
  const safeTotalCount = Math.min(Math.max(totalCount, 1), STAMP_TOTAL_COUNT);
  const safeCompletedCount = Math.min(
    Math.max(completedCount, 0),
    safeTotalCount,
  );
  const remainingCount = safeTotalCount - safeCompletedCount;
  const stamps = useMemo(
    () =>
      Array.from({ length: safeTotalCount }, (_, index) => ({
        id: index,
        isCompleted: index < safeCompletedCount,
      })),
    [safeCompletedCount, safeTotalCount],
  );
  const guideText =
    rewardText ??
    (remainingCount > 0
      ? `${remainingCount}개 더 모으면 엠블럼 획득`
      : "엠블럼 획득 완료");

  return (
    <View
      className="w-full gap-5 rounded-[24px] bg-white px-5 py-5"
      style={{ borderColor: "#E0D6C2", borderWidth: 1 }}
    >
      <View className="gap-1">
        <Text className="text-[22px] font-black text-gray-01" numberOfLines={1}>
          {title}
        </Text>
        <Text className="text-[13px] font-medium text-gray-03">
          {safeCompletedCount}개 수집 완료
        </Text>
      </View>

      <View className="gap-2">
        {[0, 1].map((rowIndex) => (
          <View
            key={rowIndex}
            className="flex-row items-center justify-between px-1"
          >
            {stamps.slice(rowIndex * 5, rowIndex * 5 + 5).map((stamp) => (
              <View
                key={stamp.id}
                className="h-[30px] w-[30px] items-center justify-center rounded-full"
                style={{
                  backgroundColor: stamp.isCompleted ? "#739E6B" : "#FFFBF1",
                  borderColor: "#E0D6C2",
                  borderWidth: 1,
                }}
              >
                {stamp.isCompleted ? (
                  <MaterialCommunityIcons
                    name="check-bold"
                    size={17}
                    color="#FFFFFF"
                  />
                ) : null}
              </View>
            ))}
          </View>
        ))}
      </View>

      <Text className="text-[15px] font-medium leading-5 text-main-orange">
        {safeCompletedCount}/{safeTotalCount} · {guideText}
      </Text>

      <Pressable
        className="h-[46px] items-center justify-center rounded-[16px] bg-main-orange"
        onPress={() => {
          if (onPress) {
            onPress();
            return;
          }

          router.push("/regionMissionList");
        }}
      >
        <Text className="text-[16px] font-bold text-white">
          {buttonTitle}
        </Text>
      </Pressable>
    </View>
  );
}
