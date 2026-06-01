import getStamps from "@/api/stampsAndEmblems/getStamps";
import { useAuthStore } from "@/store/login/useAuthStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import Button from "../buttons/Button";

type StampCouponProps = {
  title?: string;
  completedCount?: number;
  totalCount?: number;
  rewardText?: string;
  isMissionPage?: boolean;
  regionId?: string;
  onPress?: () => void;
};

const STAMP_TOTAL_COUNT = 10;
const DEFAULT_REGION_ID = "1";

export default function StampCoupon({
  title = "단양 스탬프 쿠폰",
  completedCount,
  totalCount,
  rewardText,
  isMissionPage = false,
  regionId = DEFAULT_REGION_ID,
  onPress,
}: StampCouponProps) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data: stampData } = useQuery({
    queryKey: ["STAMPS", regionId, accessToken],
    queryFn: () => getStamps(accessToken, regionId),
    enabled: Boolean(accessToken && regionId),
    retry: false,
  });

  const resolvedCompletedCount =
    completedCount ?? stampData?.collected_stamps ?? 8;
  const resolvedTotalCount = totalCount ?? stampData?.total_stamps ?? 10;
  const resolvedRewardText = rewardText ?? stampData?.next_reward_text;

  const safeTotalCount = Math.min(
    Math.max(resolvedTotalCount, 1),
    STAMP_TOTAL_COUNT,
  );
  const safeCompletedCount = Math.min(
    Math.max(resolvedCompletedCount, 0),
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
    resolvedRewardText ??
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
      {!isMissionPage && (
        <Button
          title="미션 보기"
          size="large"
          color="active"
          onPress={() => {
            if (onPress) {
              onPress();
              return;
            }

            router.push({
              pathname: "/regionMissionList",
              params: { regionId },
            });
          }}
        />
      )}
    </View>
  );
}
