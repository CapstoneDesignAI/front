import { Platform, Text, View } from "react-native";
import { WebView } from "react-native-webview";

import BottomSheet from "@/components/maps/BottomSheet";
import { ThemedView } from "@/components/themed-view";

const kakaoMapWebUrl =
  process.env.EXPO_PUBLIC_KAKAO_MAP_URL ??
  Platform.select({
    android: "http://10.0.2.2:5173",
    default: "http://localhost:5173",
  });

export default function MapsScreen() {
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
