import React from "react";
import { View } from "react-native";
import FilterButton from "../buttons/FilterButton";

export const historyOptions = ["전체", "동선", "스탬프", "엠블럼"] as const;
export type HistoryOption = (typeof historyOptions)[number];

type ItemOptionsProps = {
  selectedOption: HistoryOption;
  onSelectOption: (option: HistoryOption) => void;
};

export default function ItemOptions({
  selectedOption,
  onSelectOption,
}: ItemOptionsProps) {
  return (
    <View className="flex-row gap-[6px]">
      {historyOptions.map((option) => (
        <FilterButton
          key={option}
          title={option}
          isSelected={selectedOption === option}
          onPress={() => onSelectOption(option)}
        />
      ))}
    </View>
  );
}
