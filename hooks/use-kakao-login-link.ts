import { useAuthStore } from "@/store/login/useAuthStore";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useCallback } from "react";

export function useKakaoLoginLink() {
  return useCallback((url: string) => {
    const parsed = Linking.parse(url);

    if (parsed.path !== "login/success") {
      return false;
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
      return false;
    }

    useAuthStore.setState({
      isLogin: true,
      accessToken: String(accessToken),
      refreshToken: String(refreshToken),
    });
    router.replace("/(tabs)");

    return true;
  }, []);
}
