import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export default function Header() {
  return (
    <View className="h-[90px] flex-row items-center justify-between px-5 bg-background border-b border-gray-04 pt-[35px]">
      <Text className="text-[28px] font-black text-gray-01">
        Tripick
      </Text>
      <View className="flex-row items-center rounded-full bg-main-04 px-3 py-1.5">
        <MaterialCommunityIcons
          name="map-marker-outline"
          size={20}
          color="#7D9AAE"
        />
        <Text className="text-[17px] text-gray-02 ml-1 font-medium">
          춘천시 24°
        </Text>
      </View>
    </View>
  );
}
