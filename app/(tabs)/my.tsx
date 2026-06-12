import getUserProfile from "@/api/user/getUserProfile";
import postLogout from "@/api/login/postLogout";
import getEmblems from "@/api/stampsAndEmblems/getEmblems";
import SmallEmblemItem from "@/components/history/SmallEmblemItem";
import MyProfileCard from "@/components/my/MyProfileCard";
import { useAuthStore } from "@/store/login/useAuthStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Pressable, ScrollView, Text, View } from "react-native";

const acquiredEmblems = [
  {
    type: "explorer" as const,
    title: "단양 로컬\n탐험가",
    status: "획득 완료",
  },
  {
    type: "traveler" as const,
    title: "구례 숲길\n산책자",
    status: "획득 완료",
  },
];

const lockedEmblems = [
  {
    title: "영월 감성\n여행자",
    status: "스탬프 필요",
  },
  {
    title: "단양 골목\n발견자",
    status: "스탬프 필요",
  },
];

const menuItems = [
  {
    title: "알림 설정",
    icon: "bell-outline" as const,
  },
  {
    title: "이용 약관",
    icon: "file-document-outline" as const,
  },
  {
    title: "개인 정보수집",
    icon: "shield-account-outline" as const,
  },
];

function MenuRow({
  title,
  icon,
  isLast = false,
}: {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  isLast?: boolean;
}) {
  return (
    <Pressable
      className={`flex-row items-center gap-3 px-4 py-4 ${
        isLast ? "" : "border-b border-gray-04"
      }`}
    >
      <View className="h-9 w-9 items-center justify-center rounded-full bg-main-light-orange">
        <MaterialCommunityIcons name={icon} size={20} color="#F08057" />
      </View>

      <View className="min-w-0 flex-1">
        <Text className="text-[15px] font-bold text-gray-01">{title}</Text>
      </View>

      <MaterialCommunityIcons name="chevron-right" size={22} color="#A59A93" />
    </Pressable>
  );
}

export default function MyScreen() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setLoginState = useAuthStore((state) => state.setLoginState);
  const setUser = useAuthStore((state) => state.setUser);

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["USER_PROFILE", accessToken],
    queryFn: () => getUserProfile(accessToken),
    enabled: Boolean(accessToken),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const { data: emblems } = useQuery({
    queryKey: ["EMBLEMS", accessToken],
    queryFn: () => getEmblems(accessToken),
    enabled: Boolean(accessToken),
    retry: false,
  });

  const nickname = isLoading
    ? "불러오는 중..."
    : (userProfile?.nickName ?? "로그인이 필요합니다.");
  const visibleEmblems = emblems?.length ? emblems.slice(0, 4) : [];

  const handleLogout = async () => {
    try {
      await postLogout(accessToken);
    } finally {
      setLoginState(false, "", "");
      setUser(null);
      router.replace("/");
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="grow px-6 pb-[104px] pt-8"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-6">
        <Text className="text-[28px] font-black text-gray-01">마이</Text>

        <MyProfileCard
          nickname={nickname}
          profileImageUri={userProfile?.profile_img || (userProfile as any)?.profile_image || (userProfile as any)?.image_url}
          isLoading={isLoading}
        />

        <View className="gap-3">
          <Text className="text-[18px] font-bold text-gray-01">
            획득한 엠블럼
          </Text>

          <View className="flex-row flex-wrap justify-between gap-y-7">
            {visibleEmblems.length
              ? visibleEmblems.map((emblem) => (
                  <SmallEmblemItem
                    key={emblem.emblem_id}
                    title={emblem.name}
                    imageUrl={emblem.image_url}
                    status="획득 완료"
                  />
                ))
              : acquiredEmblems.map((emblem) => (
                  <SmallEmblemItem
                    key={emblem.title}
                    type={emblem.type}
                    title={emblem.title}
                    status={emblem.status}
                  />
                ))}

            {(visibleEmblems.length ? lockedEmblems.slice(0, 4 - visibleEmblems.length) : lockedEmblems).map(
              (emblem) => (
                <SmallEmblemItem
                  key={emblem.title}
                  title={emblem.title}
                  status={emblem.status}
                  isLocked
                />
              ),
            )}
          </View>
        </View>

        <View className="gap-3">
          <Text className="text-[18px] font-bold text-gray-01">설정</Text>

          <View className="overflow-hidden rounded-[18px] bg-white">
            {menuItems.map((item, index) => (
              <MenuRow
                key={item.title}
                title={item.title}
                icon={item.icon}
                isLast={index === menuItems.length - 1}
              />
            ))}
          </View>

          <View className="flex-row gap-3">
            <Pressable
              className="h-[46px] flex-1 items-center justify-center rounded-[16px] border border-gray-04 bg-background"
              onPress={handleLogout}
            >
              <Text className="text-[14px] font-bold text-gray-02">
                로그아웃
              </Text>
            </Pressable>

            <Pressable className="h-[46px] flex-1 items-center justify-center rounded-[16px] border border-gray-04 bg-background">
              <Text className="text-[14px] font-medium text-gray-03">
                회원 탈퇴
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
