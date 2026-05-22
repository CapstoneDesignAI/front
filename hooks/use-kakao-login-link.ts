import { useAuthStore } from "@/store/login/useAuthStore";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useCallback } from "react";

type ServiceTokenPayload = {
  iss?: string;
  sub?: string;
  type?: string;
};

export function useKakaoLoginLink() {
  return useCallback((url: string) => {
    console.log("login redirect url:", url);

    const parsed = Linking.parse(url);
    console.log("login redirect parsed:", parsed);

    if (!parsed.path?.endsWith("login/success")) {
      console.log("ignored login redirect path:", parsed.path);
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
      console.log("missing login tokens:", parsed.queryParams);
      return false;
    }

    const accessTokenPayload = decodeJwtPayload(String(accessToken));
    console.log("accessToken payload:", accessTokenPayload);

    if (
      !accessTokenPayload ||
      accessTokenPayload.iss !== "capstoneai" ||
      accessTokenPayload.type !== "access" ||
      !accessTokenPayload.sub
    ) {
      console.log("ignored non-service access token");
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

function decodeJwtPayload(token: string): ServiceTokenPayload | null {
  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload =
      normalizedPayload + "=".repeat((4 - (normalizedPayload.length % 4)) % 4);

    return JSON.parse(globalThis.atob(paddedPayload)) as ServiceTokenPayload;
  } catch {
    return null;
  }
}
