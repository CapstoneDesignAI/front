import deleteRoute from "@/api/routes/deleteRoute";
import getRoutes from "@/api/routes/getRoutes";
import getEmblems from "@/api/stampsAndEmblems/getEmblems";
import EmblemItem from "@/components/history/EmblemItem";
import ItemOptions, { HistoryOption } from "@/components/history/ItemOptions";
import MissionItem from "@/components/history/MissionItem";
import StampCoupon from "@/components/history/StampCoupon";
import { useAuthStore } from "@/store/login/useAuthStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

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

const formatSavedDate = (date?: string) => {
  if (!date) {
    return "저장됨";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "저장됨";
  }

  return `${parsedDate
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\.$/, "")} 저장`;
};

const getRouteId = (route: IRouteRecommendation) =>
  route.route_id ?? route.id ?? route.title;

const getRouteSummary = (route: IRouteRecommendation) =>
  route.places
    ?.map((place) => place.name)
    .slice(0, 4)
    .join(" · ") ||
  (route.place_count ? `${route.place_count}개 장소로 구성된 추천 동선` : "저장한 추천 동선");

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
  onDelete,
}: {
  id: string;
  title: string;
  date: string;
  summary: string;
  count: number;
  onDelete: () => void;
}) {
  return (
    <View className="overflow-hidden rounded-[24px] border border-gray-04 bg-white shadow-sm">
      <View className="relative h-[86px] bg-[#D6E8F0]">
        <View className="absolute bottom-[-38px] left-[-8px] h-[96px] w-[96px] rounded-full bg-white/25" />
        <View className="absolute right-[18px] top-[18px] h-[34px] w-[34px] items-center justify-center rounded-full bg-white">
          <MaterialCommunityIcons name="routes" size={20} color="#739E6B" />
        </View>
        <View className="absolute bottom-[14px] left-[18px] flex-row items-center rounded-full bg-white/85 px-[12px] py-[6px]">
          <MaterialCommunityIcons
            name="map-marker-path"
            size={15}
            color="#F08057"
          />
          <Text className="ml-[5px] text-[12px] font-bold text-main-orange">
            {count}개 장소
          </Text>
        </View>
      </View>

      <View className="gap-[16px] p-5">
        <View className="gap-[8px]">
          <View className="flex-row items-start justify-between gap-3">
            <Text
              className="min-w-0 flex-1 text-[19px] font-black leading-6 text-gray-01"
              numberOfLines={1}
            >
              {title}
            </Text>
            <View className="rounded-full bg-main-light-orange px-[10px] py-[4px]">
              <Text className="text-[11px] font-bold text-main-orange">
                저장됨
              </Text>
            </View>
          </View>
          <Text className="text-[12px] font-medium text-gray-03">{date}</Text>
          <Text className="text-[14px] leading-5 text-gray-02" numberOfLines={2}>
            {summary}
          </Text>
        </View>

        <View className="h-px bg-gray-04" />

        <View className="flex-row items-center justify-between gap-3">
          <View className="min-w-0 flex-1 flex-row items-center">
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={18}
              color="#739E6B"
            />
            <Text
              className="ml-[5px] flex-1 text-[13px] font-medium text-gray-02"
              numberOfLines={1}
            >
              이어서 볼 수 있는 추천 동선
            </Text>
          </View>
          <Pressable
            className="h-[38px] w-[38px] items-center justify-center rounded-full border border-gray-04"
            onPress={onDelete}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={18}
              color="#A0A0A0"
            />
          </Pressable>
          <Pressable
            className="h-[38px] items-center justify-center rounded-full bg-main-green px-[14px]"
            onPress={() =>
              router.push({
                pathname: "/route-detail",
                params: { id, source: "saved" },
              })
            }
          >
            <Text className="text-[13px] font-bold text-white">상세 보기</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [selectedOption, setSelectedOption] = useState<HistoryOption>("전체");
  const queryClient = useQueryClient();

  const { data: emblems } = useQuery({
    queryKey: ["EMBLEMS", accessToken],
    queryFn: () => getEmblems(accessToken),
    enabled: Boolean(accessToken),
    retry: false,
  });

  const {
    data: savedRoutes = [],
    isError: isSavedRoutesError,
    isLoading: isSavedRoutesLoading,
  } = useQuery({
    queryKey: ["SAVED_ROUTES", accessToken],
    queryFn: () => getRoutes(accessToken),
    enabled: Boolean(accessToken),
    retry: false,
  });

  const { mutate: removeRoute } = useMutation({
    mutationFn: (routeId: string) => deleteRoute(accessToken, routeId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["SAVED_ROUTES"] });
      Alert.alert("삭제 완료", "저장한 동선을 삭제했어요.");
    },
    onError: (error) => {
      Alert.alert(
        "삭제 실패",
        error instanceof Error
          ? error.message
          : "저장한 동선을 삭제하지 못했어요.",
      );
    },
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
              actionText={`${savedRoutes.length}개`}
            />
            {!accessToken ? (
              <View className="min-h-[132px] items-center justify-center rounded-[22px] border border-gray-04 bg-white px-5">
                <Text className="text-[15px] font-bold text-gray-01">
                  로그인이 필요해요
                </Text>
                <Text className="mt-2 text-center text-[13px] leading-5 text-gray-02">
                  저장한 동선을 보려면 다시 로그인해 주세요.
                </Text>
              </View>
            ) : isSavedRoutesLoading ? (
              <View className="min-h-[132px] items-center justify-center rounded-[22px] border border-gray-04 bg-white">
                <ActivityIndicator color="#739E6B" />
                <Text className="mt-3 text-[13px] font-medium text-gray-02">
                  저장한 동선을 불러오는 중이에요
                </Text>
              </View>
            ) : isSavedRoutesError ? (
              <View className="min-h-[132px] items-center justify-center rounded-[22px] border border-gray-04 bg-white px-5">
                <Text className="text-[15px] font-bold text-gray-01">
                  동선을 불러오지 못했어요
                </Text>
              </View>
            ) : savedRoutes.length ? (
              savedRoutes.map((route) => {
                const id = getRouteId(route);

                return (
                  <SavedTripCard
                    key={id}
                    id={id}
                    title={route.title}
                    date={formatSavedDate(route.saved_at ?? route.created_at)}
                    summary={getRouteSummary(route)}
                    count={route.place_count ?? route.places?.length ?? 0}
                    onDelete={() => removeRoute(id)}
                  />
                );
              })
            ) : (
              <View className="min-h-[132px] items-center justify-center rounded-[22px] border border-gray-04 bg-white px-5">
                <Text className="text-[15px] font-bold text-gray-01">
                  저장한 동선이 없어요
                </Text>
                <Text className="mt-2 text-center text-[13px] leading-5 text-gray-02">
                  추천 상세에서 마음에 드는 동선을 저장해 보세요.
                </Text>
              </View>
            )}
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
