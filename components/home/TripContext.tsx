import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import FilterButton from "../buttons/FilterButton";

const with_who: string[] = ["혼자", "친구", "연인", "가족"];
const transportation = ["도보", "대중교통", "자가용"];
const budget = ["가성비", "적당히", "상관 없음"];

interface Props {
  isOpen: boolean;
  onToggle: () => void;
}

export default function TripContext({ isOpen, onToggle }: Props) {
  return (
    <View
      className={`flex px-[15px] pt-[12px] pb-[6px] w-[360px] ${isOpen ? "h-[400px]" : "h-[62px]"} bg-background shadow-sm rounded-[24px] border border-gray-04`}
    >
      <View className="flex-1 gap-[20px]">
        <Text className="text-gray-01 text-[17px] font-bold">이번 여행은 어떤가요?</Text>
        {isOpen && (
          <View className="gap-[10px]">
            <View className="gap-[10px]">
              <Text className="text-gray-02 text-[15px]">누구와</Text>
              <View className="flex-row gap-[10px]">
                {with_who.map((item, idx) => (
                  <FilterButton
                    title={item}
                    key={idx}
                    isSelected={false}
                    onPress={() => {
                      return;
                    }}
                  />
                ))}
              </View>
            </View>
            <View className="gap-[10px]">
              <Text className="text-gray-02 text-[15px]">이동 수단</Text>
              <View className="flex-row gap-[10px]">
                {transportation.map((item, idx) => (
                  <FilterButton
                    title={item}
                    key={idx}
                    isSelected={false}
                    onPress={() => {
                      return;
                    }}
                  />
                ))}
              </View>
            </View>
            <View className="gap-[10px]">
              <Text className="text-gray-02 text-[15px]">예산</Text>
              <View className="flex-row gap-[10px]">
                {budget.map((item, idx) => (
                  <FilterButton
                    title={item}
                    key={idx}
                    isSelected={false}
                    onPress={() => {
                      return;
                    }}
                  />
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
      <Pressable className="items-center" hitSlop={8} onPress={onToggle}>
        <MaterialCommunityIcons
          name="chevron-down"
          size={24}
          color="#7D9AAE"
          style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}
        />
      </Pressable>
    </View>
  );
}
