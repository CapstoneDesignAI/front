import deleteRoute from "@/api/routes/deleteRoute";
import getRoutes from "@/api/routes/getRoutes";
import getMissionsList from "@/api/missions/getMissionsList";
import getEmblems from "@/api/stampsAndEmblems/getEmblems";
import getStamps from "@/api/stampsAndEmblems/getStamps";
import EmblemItem from "@/components/history/EmblemItem";
import ItemOptions, { HistoryOption } from "@/components/history/ItemOptions";
import MissionItem from "@/components/history/MissionItem";
import SmallEmblemItem from "@/components/history/SmallEmblemItem";
import StampCoupon from "@/components/history/StampCoupon";
import { useAuthStore } from "@/store/login/useAuthStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const ALL_REGION_ID = "__all__";
const EMBLEM_REGION_OPTION_PREFIX = "emblem-region:";

const fallbackMissions: IGetMissionItemResponse[] = [
  {
    mission_id: "local-market-snack",
    title: "로컬 시장에서 간식 먹기",
    stamp_count: 1,
    difficulty: "쉬움",
    is_completed: false,
  },
  {
    mission_id: "beach-walk",
    title: "고성 바다 산책하기",
    stamp_count: 1,
    difficulty: "쉬움",
    is_completed: false,
  },
];

type RegionOption = {
  id: string;
  label: string;
};

type EmblemViewMode = "list" | "grid";

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

const inferRegionLabel = (text?: string) => {
  if (!text) {
    return undefined;
  }

  const normalizedText = text.replace(/\n/g, " ").trim();

  if (!normalizedText) {
    return undefined;
  }

  return normalizedText.split(" ")[0];
};

const normalizeRegionLabel = (label?: string) => {
  const inferredLabel = inferRegionLabel(label);

  if (!inferredLabel) {
    return undefined;
  }

  return inferredLabel.replace(/(군|시)$/u, "");
};

const buildRegionOptions = (
  stamps: IGetStampsResponse = [],
  emblems: IGetEmblemsResponse = [],
) => {
  const regionOptionsByLabel = new Map<string, RegionOption>();
  const getFallbackRegionLabel = () =>
    `지역 ${regionOptionsByLabel.size + 1}`;
  const upsertRegionOption = (id: string, label?: string) => {
    const normalizedLabel = normalizeRegionLabel(label);

    if (!normalizedLabel) {
      return;
    }

    const existingOption = regionOptionsByLabel.get(normalizedLabel);

    if (
      existingOption &&
      !existingOption.id.startsWith(EMBLEM_REGION_OPTION_PREFIX)
    ) {
      return;
    }

    regionOptionsByLabel.set(normalizedLabel, {
      id,
      label: normalizedLabel,
    });
  };

  stamps.forEach((stamp) => {
    const matchingEmblem = emblems.find(
      (emblem) => emblem.region_id === stamp.region_id,
    );

    upsertRegionOption(
      String(stamp.region_id),
      stamp.region_name ??
        matchingEmblem?.region_name ??
        inferRegionLabel(matchingEmblem?.name) ??
        getFallbackRegionLabel(),
    );
  });

  emblems.forEach((emblem) => {
    const emblemRegionLabel =
      emblem.region_name ?? inferRegionLabel(emblem.name);

    if (emblem.region_id) {
      upsertRegionOption(String(emblem.region_id), emblemRegionLabel);
      return;
    }

    const normalizedRegionLabel = normalizeRegionLabel(emblemRegionLabel);

    if (!normalizedRegionLabel) {
      return;
    }

    upsertRegionOption(
      `${EMBLEM_REGION_OPTION_PREFIX}${normalizedRegionLabel}`,
      normalizedRegionLabel,
    );
  });

  return [
    { id: ALL_REGION_ID, label: "전체" },
    ...Array.from(regionOptionsByLabel.values()),
  ];
};

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

function RegionDropdown({
  options,
  selectedRegionId,
  onSelectRegion,
}: {
  options: RegionOption[];
  selectedRegionId: string;
  onSelectRegion: (regionId: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption =
    options.find((option) => option.id === selectedRegionId) ?? options[0];

  if (!selectedOption) {
    return null;
  }

  return (
    <View className="relative z-20 w-[118px]">
      <Pressable
        accessibilityRole="button"
        className="h-[38px] flex-row items-center justify-between rounded-full border border-gray-04 bg-white px-3"
        onPress={() => setIsOpen((prev) => !prev)}
      >
        <Text
          className="min-w-0 flex-1 text-[13px] font-bold text-gray-02"
          numberOfLines={1}
        >
          {selectedOption.label}
        </Text>
        <MaterialCommunityIcons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={18}
          color="#A59A93"
        />
      </Pressable>

      {isOpen ? (
        <View className="absolute right-0 top-[44px] w-[142px] overflow-hidden rounded-[16px] border border-gray-04 bg-white shadow-sm">
          {options.map((option) => (
            <Pressable
              key={option.id}
              className={`px-4 py-3 ${
                option.id === selectedRegionId ? "bg-main-light-orange" : ""
              }`}
              onPress={() => {
                onSelectRegion(option.id);
                setIsOpen(false);
              }}
            >
              <Text
                className={`text-[13px] ${
                  option.id === selectedRegionId
                    ? "font-bold text-main-orange"
                    : "font-medium text-gray-02"
                }`}
                numberOfLines={1}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function EmblemViewToggle({
  mode,
  onChangeMode,
}: {
  mode: EmblemViewMode;
  onChangeMode: (mode: EmblemViewMode) => void;
}) {
  return (
    <View className="flex-row rounded-full border border-gray-04 bg-white p-1">
      <Pressable
        accessibilityLabel="엠블럼 목록 보기"
        accessibilityRole="button"
        className={`h-8 w-8 items-center justify-center rounded-full ${
          mode === "list" ? "bg-main-green" : ""
        }`}
        onPress={() => onChangeMode("list")}
      >
        <MaterialCommunityIcons
          name="format-list-bulleted"
          size={18}
          color={mode === "list" ? "#FFFFFF" : "#A59A93"}
        />
      </Pressable>
      <Pressable
        accessibilityLabel="엠블럼 격자 보기"
        accessibilityRole="button"
        className={`h-8 w-8 items-center justify-center rounded-full ${
          mode === "grid" ? "bg-main-green" : ""
        }`}
        onPress={() => onChangeMode("grid")}
      >
        <MaterialCommunityIcons
          name="view-grid-outline"
          size={18}
          color={mode === "grid" ? "#FFFFFF" : "#A59A93"}
        />
      </Pressable>
    </View>
  );
}

function SavedTripCard({
  id,
  title,
  date,
  summary,
  count,
  imageUrl,
  onDelete,
  firstPlaceImageUrl,
}: {
  id: string;
  title: string;
  date: string;
  summary: string;
  count: number;
  imageUrl?: string | null;
  onDelete: () => void;
  firstPlaceImageUrl?: string | null;
}) {
  const resolvedImageUrl = imageUrl ?? firstPlaceImageUrl;

  return (
    <View className="overflow-hidden rounded-[24px] border border-gray-04 bg-white shadow-sm">
      <View className="relative h-[86px] bg-[#D6E8F0]">
        {resolvedImageUrl ? (
          <ExpoImage
            source={{ uri: resolvedImageUrl }}
            contentFit="cover"
            style={{ height: "100%", width: "100%" }}
          />
        ) : (
          <>
            <View className="absolute bottom-[-38px] left-[-8px] h-[96px] w-[96px] rounded-full bg-white/25" />
          </>
        )}
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
  const [emblemViewMode, setEmblemViewMode] =
    useState<EmblemViewMode>("list");
  const { regionId } = useLocalSearchParams<{ regionId?: string }>();
  const queryClient = useQueryClient();

  const { data: allStamps = [], isLoading: isAllStampsLoading } = useQuery({
    queryKey: ["STAMPS", accessToken, "all"],
    queryFn: () => getStamps(accessToken),
    enabled: Boolean(accessToken),
    retry: false,
  });

  const { data: allEmblems = [] } = useQuery({
    queryKey: ["EMBLEMS", accessToken, "all"],
    queryFn: () => getEmblems(accessToken),
    enabled: Boolean(accessToken),
    retry: false,
  });

  const regionOptions = useMemo(
    () => buildRegionOptions(allStamps, allEmblems),
    [allEmblems, allStamps],
  );
  const selectedRegionId = regionId ?? ALL_REGION_ID;
  const selectedRegionOption =
    regionOptions.find((option) => option.id === selectedRegionId) ??
    regionOptions[0];
  const isAllRegionsSelected = selectedRegionId === ALL_REGION_ID;
  const isEmblemRegionOption = selectedRegionId.startsWith(
    EMBLEM_REGION_OPTION_PREFIX,
  );
  const selectedRegionQueryId =
    isAllRegionsSelected || isEmblemRegionOption ? undefined : selectedRegionId;
  const ownedRegionOptions = regionOptions.filter(
    (option) =>
      option.id !== ALL_REGION_ID &&
      !option.id.startsWith(EMBLEM_REGION_OPTION_PREFIX),
  );

  const { data: missionData, isLoading: isMissionsLoading } = useQuery({
    queryKey: ["MISSIONS", selectedRegionId, accessToken],
    queryFn: () => getMissionsList(accessToken, selectedRegionId),
    enabled: Boolean(accessToken && selectedRegionQueryId),
    retry: false,
  });
  const allMissionResults = useQueries({
    queries: ownedRegionOptions.map((option) => ({
      queryKey: ["MISSIONS", option.id, accessToken],
      queryFn: () => getMissionsList(accessToken, option.id),
      enabled: Boolean(accessToken && !selectedRegionQueryId),
      retry: false,
    })),
  });

  const {
    data: savedRoutes = [],
    isError: isSavedRoutesError,
    isLoading: isSavedRoutesLoading,
  } = useQuery({
    queryKey: ["SAVED_ROUTES", accessToken, selectedRegionQueryId ?? "all"],
    queryFn: () => getRoutes(accessToken, selectedRegionQueryId),
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
  const visibleEmblems = isAllRegionsSelected
    ? allEmblems
    : allEmblems.filter((emblem) => {
        const emblemRegionLabel =
          normalizeRegionLabel(emblem.region_name) ??
          normalizeRegionLabel(emblem.name);
        const selectedRegionLabel = normalizeRegionLabel(
          selectedRegionOption?.label,
        );

        return (
          emblem.region_id === selectedRegionId ||
          emblemRegionLabel === selectedRegionLabel
        );
      });
  const allRegionMissions = allMissionResults.flatMap(
    (result) => result.data ?? [],
  );
  const isAllMissionsLoading = allMissionResults.some(
    (result) => result.isLoading,
  );
  const missions = !selectedRegionQueryId
    ? allRegionMissions
    : missionData?.length
      ? missionData
      : fallbackMissions;
  const inProgressMissions = missions.filter((mission) => !mission.is_completed);
  const completedMissions = missions.filter((mission) => mission.is_completed);
  const isMissionListLoading = !selectedRegionQueryId
    ? isAllMissionsLoading
    : isMissionsLoading;

  const handleSelectRegion = (nextRegionId: string) => {
    router.setParams({ regionId: nextRegionId });
  };

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

        <View className="z-20 flex-row items-center gap-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="min-w-0 flex-1"
          >
            <ItemOptions
              selectedOption={selectedOption}
              onSelectOption={setSelectedOption}
            />
          </ScrollView>
          <RegionDropdown
            options={regionOptions}
            selectedRegionId={selectedRegionId}
            onSelectRegion={handleSelectRegion}
          />
        </View>
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
                    imageUrl={route.image_url}
                    firstPlaceImageUrl={route.places?.[0]?.image_url}
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
            {!selectedRegionQueryId ? (
              isAllStampsLoading ? (
                <View className="min-h-[96px] items-center justify-center rounded-[18px] bg-white">
                  <ActivityIndicator color="#739E6B" />
                  <Text className="mt-3 text-[13px] font-medium text-gray-02">
                    스탬프를 불러오는 중이에요
                  </Text>
                </View>
              ) : allStamps.length ? (
                allStamps.map((stamp) => (
                  <StampCoupon key={stamp.region_id} regionId={stamp.region_id} />
                ))
              ) : (
                <View className="min-h-[96px] items-center justify-center rounded-[18px] bg-white px-5">
                  <Text className="text-[14px] font-bold text-gray-01">
                    모은 스탬프가 없어요
                  </Text>
                </View>
              )
            ) : (
              <StampCoupon regionId={selectedRegionId} />
            )}
            {selectedOption === "스탬프" ? (
              <View className="gap-5">
                {isMissionListLoading ? (
                  <View className="min-h-[96px] items-center justify-center rounded-[18px] bg-white">
                    <ActivityIndicator color="#739E6B" />
                    <Text className="mt-3 text-[13px] font-medium text-gray-02">
                      미션을 불러오는 중이에요
                    </Text>
                  </View>
                ) : missions.length === 0 ? (
                  <View className="min-h-[96px] items-center justify-center rounded-[18px] bg-white px-5">
                    <Text className="text-[14px] font-bold text-gray-01">
                      표시할 미션이 없어요
                    </Text>
                  </View>
                ) : (
                  <>
                    <View className="gap-3">
                      <SectionTitle
                        title="진행 중인 미션"
                        actionText={`${inProgressMissions.length}개`}
                      />
                      {inProgressMissions.length ? (
                        inProgressMissions.map((mission) => (
                          <MissionItem
                            key={mission.mission_id}
                            missionId={mission.mission_id}
                            title={mission.title}
                            rewardText={`스탬프 ${mission.stamp_count}개`}
                            difficulty={mission.difficulty}
                            isCompleted={false}
                          />
                        ))
                      ) : (
                        <View className="min-h-[96px] items-center justify-center rounded-[18px] bg-white px-5">
                          <Text className="text-[14px] font-bold text-gray-01">
                            진행 중인 미션이 없어요
                          </Text>
                        </View>
                      )}
                    </View>

                    <View className="gap-3">
                      <SectionTitle
                        title="완료한 미션"
                        actionText={`${completedMissions.length}개`}
                      />
                      {completedMissions.length ? (
                        completedMissions.map((mission) => (
                          <MissionItem
                            key={mission.mission_id}
                            missionId={mission.mission_id}
                            title={mission.title}
                            rewardText={`스탬프 ${mission.stamp_count}개`}
                            difficulty={mission.difficulty}
                            isCompleted
                          />
                        ))
                      ) : (
                        <View className="min-h-[96px] items-center justify-center rounded-[18px] bg-white px-5">
                          <Text className="text-[14px] font-bold text-gray-01">
                            완료한 미션이 없어요
                          </Text>
                        </View>
                      )}
                    </View>
                  </>
                )}
              </View>
            ) : null}
          </View>
        ) : null}

        {showEmblems ? (
          <View className="gap-3">
            <View className="flex-row items-center justify-between gap-3">
              <View className="min-w-0 flex-1">
                <SectionTitle
                  title="획득한 엠블럼"
                  actionText={`${visibleEmblems.length || 3}개`}
                />
              </View>
              <EmblemViewToggle
                mode={emblemViewMode}
                onChangeMode={setEmblemViewMode}
              />
            </View>
            {emblemViewMode === "grid" ? (
              <View className="flex-row flex-wrap gap-3 rounded-[22px] bg-white p-4">
                {visibleEmblems.length ? (
                  visibleEmblems.map((emblem) => (
                    <SmallEmblemItem
                      key={emblem.emblem_id}
                      variant="icon"
                      title={emblem.name}
                      description={emblem.description}
                      imageUrl={emblem.image_url}
                      acquiredDate={emblem.acquired_at}
                    />
                  ))
                ) : (
                  <>
                    <SmallEmblemItem variant="icon" type="master" />
                    <SmallEmblemItem variant="icon" type="traveler" />
                    <SmallEmblemItem variant="icon" type="explorer" />
                  </>
                )}
              </View>
            ) : visibleEmblems.length ? (
              visibleEmblems.map((emblem) => (
                <EmblemItem
                  key={emblem.emblem_id}
                  title={emblem.name}
                  imageUrl={emblem.image_url}
                  completedMissionCount={emblem.unlock_stamp_threshold}
                  acquiredDate={emblem.acquired_at}
                  description={emblem.description}
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
