import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function MapsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Maps</ThemedText>
        <ThemedText>위치와 경로를 확인하는 지도 화면입니다.</ThemedText>
      </ThemedView>
      <ThemedView style={styles.mapPlaceholder}>
        <ThemedText type="subtitle">Map Area</ThemedText>
      </ThemedView>
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
  mapPlaceholder: {
    alignItems: 'center',
    borderColor: '#A8B3BD',
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 320,
  },
});
