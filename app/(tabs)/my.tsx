import getUserProfile from "@/api/user/getUserProfile";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuthStore } from "@/store/login/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { ScrollView, StyleSheet } from "react-native";

const DEFAULT_PROFILE_IMAGE = require("@/assets/images/icon.png");

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
    : userProfile?.nickName ?? "로그인이 필요합니다.";

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.profileSection}>
          <Image
            source={
              userProfile?.profile_img
                ? { uri: userProfile.profile_img }
                : DEFAULT_PROFILE_IMAGE
            }
            style={styles.profileImage}
            contentFit="cover"
          />
          <ThemedText type="subtitle">{nickname}</ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 104,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  profileSection: {
    alignItems: "center",
    gap: 16,
    paddingTop: 48,
  },
  profileImage: {
    borderRadius: 75,
    height: 150,
    width: 150,
  },
});
