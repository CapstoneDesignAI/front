import getEmblems from "@/api/stampsAndEmblems/getEmblems";
import EmblemItem from "@/components/history/EmblemItem";
import ItemOptions, { HistoryOption } from "@/components/history/ItemOptions";
import MissionItem from "@/components/history/MissionItem";
import StampCoupon from "@/components/history/StampCoupon";
import { useAuthStore } from "@/store/login/useAuthStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const DEFAULT_REGION_ID = "1";

const missions = [
  {
    title: "로컬 시장에서 간식 먹기",
    rewardText: "사진 업로드 · 스탬프 1개",
    difficulty: "쉬움",
  },
  {
    title: "고성 바다 산책하기",
    rewardText: "위치 인증 · 스탬프 1개",
    difficulty: "쉬움",
  },
];

const savedTrips = [
  {
    id: "gangneung-healing",
    title: "강릉 초당 감성 힐링 코스",
    date: "2026.05.30 저장",
    summary: "안목해변 카페거리 · 초당순두부마을 · 경포호",
    count: 3,
  },
  {
    id: "danyang-local",
    title: "단양 로컬 산책 코스",
    date: "2026.05.28 저장",
    summary: "구경시장 · 수양개빛터널 · 도담삼봉",
    count: 3,
  },
];

function SectionTitle({
  title,
  actionText,
}: {
  title: string;
  actionText?: string;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-[18px] font-bold text-gray-01">{title}</Text>
      {actionText ? (
        <Text className="text-[13px] font-medium text-gray-03">
          {actionText}
        </Text>
      ) : null}
    </View>
  );
}

function SavedTripCard({
  id,
  title,
  date,
  summary,
  count,
}: {
  id: string;
  title: string;
  date: string;
  summary: string;
  count: number;
}) {
  return (
    <View className="rounded-[18px] bg-white p-5">
      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1 gap-2">
          <Text
            className="text-[17px] font-bold leading-6 text-gray-01"
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text className="text-[13px] text-gray-03">{date}</Text>
          <Text className="text-[14px] leading-5 text-gray-02">{summary}</Text>
        </View>

        <View className="h-11 w-11 items-center justify-center rounded-full bg-main-light-orange">
          <MaterialCommunityIcons name="routes" size={24} color="#739E6B" />
        </View>
      </View>

      <View className="mt-4 flex-row items-center gap-2">
        <MaterialCommunityIcons
          name="map-marker-path"
          size={18}
          color="#F08057"
        />
        <Text className="text-[13px] font-medium text-main-orange">
          {count}개 장소 동선
        </Text>
      </View>

      <Pressable
        className="mt-4 h-[42px] items-center justify-center rounded-[14px] bg-main-light-orange"
        onPress={() =>
          router.push({
            pathname: "/route-detail",
            params: { id },
          })
        }
      >
        <Text className="text-[14px] font-bold text-main-orange">
          동선 자세히 보기
        </Text>
      </Pressable>
    </View>
  );
}

export default function HistoryScreen() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [selectedOption, setSelectedOption] = useState<HistoryOption>("전체");

  const { data: emblems } = useQuery({
    queryKey: ["EMBLEMS", accessToken],
    queryFn: () => getEmblems(accessToken),
    enabled: Boolean(accessToken),
    retry: false,
  });

  const showRoutes = selectedOption === "전체" || selectedOption === "동선";
  const showStamps = selectedOption === "전체" || selectedOption === "스탬프";
  const showEmblems = selectedOption === "전체" || selectedOption === "엠블럼";
  const visibleEmblems = emblems?.length ? emblems : [];

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="grow px-6 pb-[104px] pt-5"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-6">
        <View className="gap-3">
          <Text className="text-[28px] font-black text-gray-01">나의 여행</Text>
          <Text className="text-[15px] leading-6 text-gray-02">
            저장한 동선과 모은 스탬프, 엠블럼을 한눈에 확인해보세요.
          </Text>
        </View>

        <ItemOptions
          selectedOption={selectedOption}
          onSelectOption={setSelectedOption}
        />
        {showRoutes ? (
          <View className="gap-3">
            <SectionTitle
              title="저장한 동선"
              actionText={`${savedTrips.length}개`}
            />
            {savedTrips.map((trip) => (
              <SavedTripCard key={trip.title} {...trip} />
            ))}
          </View>
        ) : null}

        {showStamps ? (
          <View className="gap-3">
            <SectionTitle title="스탬프 쿠폰" />
            <StampCoupon regionId={DEFAULT_REGION_ID} />
            {selectedOption === "스탬프" ? (
              <View className="gap-3">
                <SectionTitle title="진행 중인 미션" />
                {missions.map((mission) => (
                  <MissionItem
                    key={mission.title}
                    title={mission.title}
                    rewardText={mission.rewardText}
                    difficulty={mission.difficulty}
                  />
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        {showEmblems ? (
          <View className="gap-3">
            <SectionTitle
              title="획득한 엠블럼"
              actionText={`${visibleEmblems.length || 3}개`}
            />
            {visibleEmblems.length ? (
              visibleEmblems.map((emblem) => (
                <EmblemItem
                  key={emblem.emblem_id}
                  title={emblem.name}
                  imageUrl={emblem.image_url}
                  completedMissionCount={emblem.unlock_stamp_threshold}
                  acquiredDate={emblem.acquired_at}
                />
              ))
            ) : (
              <>
                <EmblemItem type="master" />
                <EmblemItem type="traveler" />
                <EmblemItem type="explorer" />
              </>
            )}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
