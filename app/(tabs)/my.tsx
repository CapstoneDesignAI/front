import getUserProfile from "@/api/user/getUserProfile";
import SmallEmblemItem from "@/components/history/SmallEmblemItem";
import MyProfileCard from "@/components/my/MyProfileCard";
import { useAuthStore } from "@/store/login/useAuthStore";
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

const menuItems = ["알림 설정", "이용 약관", "개인 정보수집"];

export default function MyScreen() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["USER_PROFILE", accessToken],
    queryFn: () => getUserProfile(accessToken),
    enabled: Boolean(accessToken),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const nickname = isLoading
    ? "불러오는 중..."
    : (userProfile?.nickName ?? "로그인이 필요합니다.");

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
          profileImageUri={userProfile?.profile_img}
          isLoading={isLoading}
        />

        <View className="gap-3">
          <Text className="text-[18px] font-bold text-gray-01">
            획득한 엠블럼
          </Text>

          <View className="flex-row flex-wrap justify-between gap-y-7">
            {acquiredEmblems.map((emblem) => (
              <SmallEmblemItem
                key={emblem.title}
                type={emblem.type}
                title={emblem.title}
                status={emblem.status}
              />
            ))}

            {lockedEmblems.map((emblem) => (
              <SmallEmblemItem
                key={emblem.title}
                title={emblem.title}
                status={emblem.status}
                isLocked
              />
            ))}
          </View>
        </View>

        <View className="mt-1">
          {menuItems.map((item) => (
            <Pressable
              key={item}
              className="h-[46px] justify-center border-b border-gray-03"
            >
              <Text className="text-[14px] text-gray-01">{item}</Text>
            </Pressable>
          ))}

          <Pressable className="h-[34px] justify-center">
            <Text className="text-[13px] text-gray-01">로그아웃</Text>
          </Pressable>

          <Pressable className="h-[34px] justify-center">
            <Text className="text-[13px] text-[#FF3B30]">회원 탈퇴</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
