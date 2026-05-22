import { ScrollView, StyleSheet } from "react-native";

import RouteRecommendCard from "@/components/cards/RouteRecommendCard";
import { ThemedView } from "@/components/themed-view";

export default function HistoryScreen() {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <ThemedView style={styles.container}>
        <RouteRecommendCard />
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
    padding: 10,
  },
  titleContainer: {
    gap: 8,
  },
  list: {
    gap: 12,
  },
  item: {
    borderColor: "#D0D7DE",
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
});
