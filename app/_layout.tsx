import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as Linking from 'expo-linking';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import './global.css';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/store/login/useAuthStore';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [queryClient] = useState(() => new QueryClient());
  const [loaded] = useFonts({
    Pretendard: require('@/assets/font/Pretendard-Regular.otf'),
    PretendardSemiBold: require('@/assets/font/Pretendard-SemiBold.otf'),
    PretendardBold: require('@/assets/font/Pretendard-Bold.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const handleLoginSuccessUrl = (url: string) => {
      const parsed = Linking.parse(url);

      if (parsed.path !== 'login/success') {
        return;
      }

      const accessTokenParam = parsed.queryParams?.accessToken;
      const refreshTokenParam = parsed.queryParams?.refreshToken;
      const accessToken = Array.isArray(accessTokenParam)
        ? accessTokenParam[0]
        : accessTokenParam;
      const refreshToken = Array.isArray(refreshTokenParam)
        ? refreshTokenParam[0]
        : refreshTokenParam;

      if (!accessToken || !refreshToken) {
        return;
      }

      useAuthStore.setState({
        isLogin: true,
        accessToken: String(accessToken),
        refreshToken: String(refreshToken),
      });
      router.replace('/(tabs)');
    };

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleLoginSuccessUrl(url);
      }
    });

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleLoginSuccessUrl(url);
    });

    return () => subscription.remove();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
