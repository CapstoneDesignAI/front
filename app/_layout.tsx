import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "./global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useKakaoLoginLink } from "@/hooks/use-kakao-login-link";
import { useAuthStore } from "@/store/login/useAuthStore";

SplashScreen.preventAutoHideAsync();

const AUTH_STORAGE_RESET_FLAG = "auth-storage-reset-2026-06-11";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const handleKakaoLoginLink = useKakaoLoginLink();
  const [queryClient] = useState(() => new QueryClient());
  const [loaded] = useFonts({
    Pretendard: require("@/assets/font/Pretendard-Regular.otf"),
    PretendardSemiBold: require("@/assets/font/Pretendard-SemiBold.otf"),
    PretendardBold: require("@/assets/font/Pretendard-Bold.otf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const resetAuthStorageForDebug = async () => {
      const alreadyReset = await AsyncStorage.getItem(AUTH_STORAGE_RESET_FLAG);

      if (alreadyReset) {
        return;
      }

      await AsyncStorage.removeItem("user-storage");
      await AsyncStorage.setItem(AUTH_STORAGE_RESET_FLAG, "true");
      useAuthStore.setState({
        isLogin: false,
        accessToken: "",
        refreshToken: "",
        user: null,
      });
    };

    resetAuthStorageForDebug();
  }, []);

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      // console.log('initial app url:', url);
      if (url) {
        handleKakaoLoginLink(url);
      }
    });

    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("linking event url:", url);
      handleKakaoLoginLink(url);
    });

    return () => subscription.remove();
  }, [handleKakaoLoginLink]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="custom-trip"
            options={{
              title: "커스텀 여행지 추천",
              headerBackButtonDisplayMode: "minimal",
              headerStyle: { backgroundColor: "#FFF8F3" },
              headerTintColor: "#3A3A3A",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="regionMissionList"
            options={{
              title: "강원 고성 미션",
              headerBackButtonDisplayMode: "minimal",
              headerStyle: { backgroundColor: "#FFF8F3" },
              headerTintColor: "#3A3A3A",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="route-detail"
            options={{
              title: "동선 상세",
              headerBackButtonDisplayMode: "minimal",
              headerStyle: { backgroundColor: "#FFF8F3" },
              headerTintColor: "#3A3A3A",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="MissionDetail"
            options={{
              title: "미션 상세",
              headerBackButtonDisplayMode: "minimal",
              headerStyle: { backgroundColor: "#FFF8F3" },
              headerTintColor: "#3A3A3A",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="MissionVerification"
            options={{
              title: "미션 인증",
              headerBackButtonDisplayMode: "minimal",
              headerStyle: { backgroundColor: "#FFF8F3" },
              headerTintColor: "#3A3A3A",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
