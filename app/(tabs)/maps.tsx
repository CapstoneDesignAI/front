import { useAuthStore } from "@/store/login/useAuthStore";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Text, View } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

import BottomSheet from "@/components/maps/BottomSheet";
import { ThemedView } from "@/components/themed-view";

const KAKAO_MAP_BASE_URL =
  process.env.EXPO_PUBLIC_KAKAO_MAP_URL ??
  "https://capstone-kakao-map.vercel.app/";

type KakaoMapWebViewMessage = {
  type: "KAKAO_PLACE_SELECTED";
  payload: {
    place_id: string | null;
    folder_id: string | null;
    place: IKakaoPlacePayload;
  };
};

function isKakaoPlaceMessage(data: unknown): data is KakaoMapWebViewMessage {
  if (!data || typeof data !== "object") {
    return false;
  }

  const message = data as Partial<KakaoMapWebViewMessage>;
  if (message.type !== "KAKAO_PLACE_SELECTED") {
    return false;
  }

  const payload = message.payload;
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const place = (payload as Partial<KakaoMapWebViewMessage["payload"]>).place;
  if (!place || typeof place !== "object") {
    return false;
  }

  return (
    typeof place.kakao_place_id === "string" &&
    typeof place.name === "string" &&
    typeof place.latitude === "number" &&
    typeof place.longitude === "number" &&
    typeof place.address === "string" &&
    typeof place.category === "string"
  );
}

export default function MapsScreen() {
  const { accessToken } = useAuthStore();
  const { folder_id } = useLocalSearchParams<{ folder_id?: string }>();
  const [pendingPlace, setPendingPlace] = useState<IKakaoPlacePayload | null>(null);
  const [targetFolderId, setTargetFolderId] = useState<string | null>(null);

  const kakaoMapWebUrl = useMemo(() => {
    if (!folder_id) return KAKAO_MAP_BASE_URL;
    const url = new URL(KAKAO_MAP_BASE_URL);
    url.searchParams.set("folder_id", folder_id);
    return url.toString();
  }, [folder_id]);

  const handleMapMessage = (event: WebViewMessageEvent) => {
    let parsedMessage: unknown;

    try {
      parsedMessage = JSON.parse(event.nativeEvent.data);
    } catch {
      return;
    }

    if (!isKakaoPlaceMessage(parsedMessage)) {
      return;
    }

    if (!accessToken) {
      Alert.alert("로그인이 필요해요", "장소를 저장하려면 다시 로그인해 주세요.");
      return;
    }

    const { payload } = parsedMessage;
    const { place, folder_id: messageFolderId } = payload;

    const mappedPayload: IKakaoPlacePayload = {
      kakao_place_id: place.kakao_place_id,
      name: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
      address: place.address,
      category: place.category,
    };

    setTargetFolderId(messageFolderId);
    setPendingPlace(mappedPayload);
  };

  return (
    <ThemedView className="flex-1 bg-background">
      <View className="relative flex-1 overflow-hidden bg-background">
        <WebView
          source={{ uri: kakaoMapWebUrl }}
          className="flex-1"
          originWhitelist={["*"]}
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
          onMessage={handleMapMessage}
          renderError={() => (
            <View className="flex-1 items-center justify-center p-6">
              <Text className="text-base font-bold text-gray-01">
                지도를 불러올 수 없습니다.
              </Text>
              <Text className="mt-2 text-center text-[13px] text-gray-02">
                {kakaoMapWebUrl}
              </Text>
            </View>
          )}
        />
        <BottomSheet
          pendingPlace={pendingPlace}
          targetFolderId={targetFolderId}
          onCloseSavingMode={() => {
            setPendingPlace(null);
            setTargetFolderId(null);
          }}
        />
      </View>
    </ThemedView>
  );
}
