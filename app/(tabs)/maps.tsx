import { Platform, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

const kakaoMapWebUrl =
  process.env.EXPO_PUBLIC_KAKAO_MAP_URL ??
  Platform.select({
    android: "http://10.0.2.2:5173",
    default: "http://localhost:5173",
  });

export default function MapsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Maps</ThemedText>
        <ThemedText>위치와 경로를 확인하는 지도 화면입니다.</ThemedText>
      </ThemedView>
      <View style={styles.webViewFrame}>
        <WebView
          source={{ uri: kakaoMapWebUrl }}
          style={styles.webView}
          originWhitelist={["*"]}
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
          renderError={() => (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>지도를 불러올 수 없습니다.</Text>
              <Text style={styles.errorText}>{kakaoMapWebUrl}</Text>
            </View>
          )}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
    padding: 24,
    paddingTop: 72,
  },
  titleContainer: {
    gap: 8,
  },
  webView: {
    flex: 1,
  },
  webViewFrame: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D6D6D6",
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    minHeight: 420,
    overflow: "hidden",
  },
  errorContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  errorText: {
    color: "#5A5857",
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
  },
  errorTitle: {
    color: "#0D0D0D",
    fontSize: 16,
    fontWeight: "700",
  },
});
