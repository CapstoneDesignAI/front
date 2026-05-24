import getUserProfile from "@/api/user/getUserProfile";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuthStore } from "@/store/login/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { Image as ExpoImage } from "expo-image";
import { cssInterop } from "nativewind";
import { ScrollView } from "react-native";

const DEFAULT_PROFILE_IMAGE = require("@/assets/images/icon.png");

cssInterop(ExpoImage, {
  className: "style",
});

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
      contentContainerClassName="grow pb-[104px]"
      showsVerticalScrollIndicator={false}
    >
      <ThemedView className="flex-1 bg-background p-6">
        <ThemedView className="items-center gap-4 bg-background pt-12">
          <ExpoImage
            source={
              userProfile?.profile_img
                ? { uri: userProfile.profile_img }
                : DEFAULT_PROFILE_IMAGE
            }
            className="h-[150px] w-[150px] rounded-full border-[3px] border-main-green"
            contentFit="cover"
          />
          <ThemedText type="subtitle">{nickname}</ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}
