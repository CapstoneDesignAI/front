import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export default function Header() {
  return (
    <View className="h-[90px] flex-row items-center justify-between px-5 bg-white border-b border-gray-200 pt-[35px]">
      <Text className="text-[28px] font-black text-main-01 tracking-tighter">
        Tripick
      </Text>
      <View className="flex-row items-center">
        <MaterialCommunityIcons
          name="map-marker-outline"
          size={20}
          color="#4B5563"
        />
        <Text className="text-[17px] text-gray-02 ml-1 font-medium">
          춘천시 24°
        </Text>
      </View>
    </View>
  );
}
