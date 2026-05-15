import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function MyScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">My</ThemedText>
        <ThemedText>프로필과 앱 설정을 관리하는 화면입니다.</ThemedText>
      </ThemedView>
      <ThemedView style={styles.profileBox}>
        <ThemedText type="subtitle">내 정보</ThemedText>
        <ThemedText>로그인 정보와 개인 설정이 이곳에 표시됩니다.</ThemedText>
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
  profileBox: {
    borderColor: '#D0D7DE',
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
});
