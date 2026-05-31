import { MaterialCommunityIcons } from "@expo/vector-icons";
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
      className="relative h-[216px] w-[342px] rounded-[28px] bg-white"
      style={{ borderColor: "#E0D6C2", borderWidth: 1 }}
    >
      <Text
        className="absolute left-[21px] top-[18px] text-[30px] font-bold leading-[36px] text-[#1F1F1A]"
        numberOfLines={1}
      >
        {title}
      </Text>

      <View className="absolute left-[21px] top-[51px] w-[270px] gap-[5px]">
        {[0, 1].map((rowIndex) => (
          <View
            key={rowIndex}
            className="flex-row items-center justify-between"
          >
            {stamps.slice(rowIndex * 5, rowIndex * 5 + 5).map((stamp) => (
              <View
                key={stamp.id}
                className="h-[28px] w-[28px] items-center justify-center rounded-full"
                style={{
                  backgroundColor: stamp.isCompleted ? "#739E6B" : "#FFFBF1",
                  borderColor: "#E0D6C2",
                  borderWidth: 1,
                }}
              >
                {stamp.isCompleted ? (
                  <MaterialCommunityIcons
                    name="check-bold"
                    size={18}
                    color="#FFFFFF"
                  />
                ) : null}
              </View>
            ))}
          </View>
        ))}
      </View>

      <Text className="absolute left-[21px] top-[120px] text-[16px] font-medium leading-[20px] text-[#F08057]">
        {safeCompletedCount}/{safeTotalCount} 수집 완료 · {guideText}
      </Text>

      <Pressable
        className="absolute left-[21px] top-[149px] h-[34px] w-[293px] items-center justify-center rounded-full bg-[#F08057]"
        onPress={onPress}
      >
        <Text className="text-[16px] font-bold leading-[20px] text-white">
          {buttonTitle}
        </Text>
      </Pressable>
    </View>
  );
}
