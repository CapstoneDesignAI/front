import React from "react";
import { useState } from "react";
import { View } from "react-native";
import FilterButton from "../buttons/FilterButton";

const options = ["전체", "동선", "스탬프", "엠블럼"];

export default function ItemOptions() {
  const [selectedOption, setSelectedOption] = useState(options[0]);

  return (
    <View className="flex-row gap-[5px] ">
      {options.map((option, idx) => (
        <FilterButton
          key={idx}
          title={option}
          isSelected={selectedOption === option}
          onPress={() => setSelectedOption(option)}
        />
      ))}
    </View>
  );
}
