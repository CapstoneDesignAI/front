import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { FavoritePlace } from "./types";

type FavoritePlaceItemProps = {
  place: FavoritePlace;
};

export default function FavoritePlaceItem({ place }: FavoritePlaceItemProps) {
  return (
    <Pressable className="flex-row gap-3 rounded-2xl border border-[#F0F0F0] p-[14px]">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-main-05">
        <MaterialCommunityIcons name="map-marker" size={20} color="#FF7548" />
      </View>
      <View className="flex-1 gap-1.5">
        <View className="flex-row items-center">
          <Text
            className="flex-1 text-base font-bold text-gray-01"
            numberOfLines={1}
          >
            {place.name}
          </Text>
          <Text className="ml-2 text-sm font-bold text-main-01">
            {place.distance}
          </Text>
        </View>
        <Text className="text-[13px] text-gray-02" numberOfLines={1}>
          {place.description}
        </Text>
        <View className="flex-row gap-1.5">
          {place.tags.map((tag) => (
            <Text
              key={tag}
              className="rounded-full bg-main-04 px-2 py-1 text-xs font-bold text-main-01"
            >
              {tag}
            </Text>
          ))}
        </View>
      </View>
    </Pressable>
  );
}
