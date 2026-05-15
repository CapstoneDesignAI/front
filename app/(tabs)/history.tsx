import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const records = ['최근 방문 기록', '이동 경로', '활동 로그'];

export default function HistoryScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">History</ThemedText>
        <ThemedText>저장된 활동과 이동 기록을 확인하는 화면입니다.</ThemedText>
      </ThemedView>
      <ThemedView style={styles.list}>
        {records.map((record) => (
          <ThemedView key={record} style={styles.item}>
            <ThemedText type="defaultSemiBold">{record}</ThemedText>
          </ThemedView>
        ))}
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
  list: {
    gap: 12,
  },
  item: {
    borderColor: '#D0D7DE',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
});
