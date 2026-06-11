import postBookmark from "@/api/bookmarks/postBookmark";
import { useAuthStore } from "@/store/login/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Text, View } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

import BottomSheet from "@/components/maps/BottomSheet";
import { ThemedView } from "@/components/themed-view";

const kakaoMapWebUrl =
  process.env.EXPO_PUBLIC_KAKAO_MAP_URL ??
  "https://capstone-kakao-map.vercel.app/";

type KakaoMapWebViewMessage = {
  type: "KAKAO_PLACE_SELECTED";
  payload: IKakaoPlacePayload;
};

function isKakaoPlaceMessage(data: unknown): data is KakaoMapWebViewMessage {
  if (!data || typeof data !== "object") {
    return false;
  }

  const message = data as Partial<KakaoMapWebViewMessage>;
  const payload = message.payload as Partial<IKakaoPlacePayload> | undefined;

  return (
    message.type === "KAKAO_PLACE_SELECTED" &&
    Boolean(payload) &&
    typeof payload?.kakao_place_id === "string" &&
    typeof payload.name === "string" &&
    typeof payload.latitude === "number" &&
    typeof payload.longitude === "number" &&
    typeof payload.address === "string" &&
    typeof payload.category === "string"
  );
}

export default function MapsScreen() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  const savePlaceMutation = useMutation({
    mutationFn: (place: IKakaoPlacePayload) =>
      postBookmark(accessToken, { place }),
    onSuccess: async (_, place) => {
      await queryClient.invalidateQueries({
        queryKey: ["BOOKMARK_FOLDERS", accessToken],
      });
      Alert.alert("장소 저장 완료", `${place.name}을(를) 저장했습니다.`);
    },
    onError: (error) => {
      Alert.alert(
        "장소 저장 실패",
        error instanceof Error ? error.message : "장소를 저장하지 못했습니다.",
      );
    },
  });

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

    savePlaceMutation.mutate(parsedMessage.payload);
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
        <BottomSheet />
      </View>
    </ThemedView>
  );
}
