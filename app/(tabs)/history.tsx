import { StyleSheet } from "react-native";

import ToggleButton from "@/components/buttons/ToggleButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useState } from "react";

const records = ["최근 방문 기록", "이동 경로", "활동 로그"];

export default function HistoryScreen() {
  const [activeButton, setActiveButton] = useState<"left" | "right">("left"); // 예시로 왼쪽 버튼이 활성화된 상태로 설정

  const handleLeftPress = () => {
    setActiveButton("left");
  };
  const handleRightPress = () => {
    setActiveButton("right");
  };
  return (
    <ThemedView style={styles.container}>
      <ThemedView className="flex-row w-full my-[20px] items-start justify-center">
        <ToggleButton
          leftTitle="내 장소"
          rightTitle="내 동선"
          onLeftPress={handleLeftPress}
          onRightPress={handleRightPress}
          activeButton={activeButton}
          setActiveButton={setActiveButton}
        />
      </ThemedView>
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
