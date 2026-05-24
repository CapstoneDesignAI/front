import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCurrentLocation } from "@/hooks/use-current-location";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function Header() {
  const { errorMessage, isLoading, label, refresh } = useCurrentLocation();
  const locationText = isLoading ? "위치 확인 중" : label;

  return (
    <View className="h-[90px] flex-row items-center justify-between px-5 bg-background border-b border-gray-04 pt-[35px]">
      <Text className="text-[28px] font-black text-gray-01">
        Tripick
      </Text>
      <Pressable
        accessibilityLabel={errorMessage ?? "현재 위치 새로고침"}
        accessibilityRole="button"
        className="max-w-[210px] flex-row items-center rounded-full bg-main-light-orange px-3 py-1.5"
        onPress={refresh}
      >
        <MaterialCommunityIcons
          name="map-marker-outline"
          size={20}
          color="#7D9AAE"
        />
        <Text
          className="text-[15px] text-gray-02 ml-1 font-medium"
          numberOfLines={1}
        >
          {locationText}
        </Text>
      </Pressable>
    </View>
  );
}
