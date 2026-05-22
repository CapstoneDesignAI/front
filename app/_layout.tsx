import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
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

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

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

  // useEffect(() => {
  //   const resetAuthStorageForDebug = async () => {
  //     await AsyncStorage.removeItem("user-storage");
  //     useAuthStore.setState({
  //       isLogin: false,
  //       accessToken: "",
  //       refreshToken: "",
  //       user: null,
  //     });
  //   };

  //   resetAuthStorageForDebug();
  // }, []);

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
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
