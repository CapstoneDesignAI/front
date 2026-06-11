import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type FavoritePlaceItemProps = {
  onDelete: (place: IBookmarkedPlaceItem) => void;
  place: IBookmarkedPlaceItem;
};

export default function FavoritePlaceItem({
  onDelete,
  place,
}: FavoritePlaceItemProps) {
  const category = place.category || "기타";

  return (
    <Pressable className="flex-row gap-3 rounded-2xl border border-gray-04 bg-background p-[14px]">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-main-light-orange">
        <MaterialCommunityIcons name="map-marker" size={20} color="#F29B7F" />
      </View>
      <View className="flex-1 gap-1.5">
        <View className="flex-row items-center">
          <Text
            className="flex-1 text-base font-bold text-gray-01"
            numberOfLines={1}
          >
            {place.name}
          </Text>
        </View>
        <Text className="text-[13px] text-gray-02" numberOfLines={1}>
          {place.address}
        </Text>
        <View className="flex-row gap-1.5">
          <Text className="rounded-full bg-main-light-orange px-2 py-1 text-xs font-bold text-gray-01">
            {category}
          </Text>
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        className="h-9 w-9 items-center justify-center"
        hitSlop={8}
        onPress={(event) => {
          event.stopPropagation();
          onDelete(place);
        }}
      >
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={20}
          color="#F29B7F"
        />
      </Pressable>
    </Pressable>
  );
}
