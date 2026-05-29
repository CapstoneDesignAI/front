import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { FavoriteFolder } from "./types";

type FavoriteFolderItemProps = {
  folder: FavoriteFolder;
  onDeletePress?: (folder: FavoriteFolder) => void;
  onEditPress?: (folder: FavoriteFolder) => void;
  onPress: (folderId: string) => void;
};

export default function FavoriteFolderItem({
  folder,
  onDeletePress,
  onEditPress,
  onPress,
}: FavoriteFolderItemProps) {
  return (
    <Pressable
      className="flex-row items-center gap-3 rounded-2xl border border-gray-04 bg-background p-[14px]"
      onPress={() => onPress(folder.id)}
    >
      <View className="h-11 w-11 items-center justify-center rounded-full bg-main-light-orange">
        <MaterialCommunityIcons name="folder-heart" size={22} color="#F29B7F" />
      </View>
      <View className="flex-1 gap-1">
        <View className="flex-row items-center">
          <Text
            className="flex-1 text-base font-bold text-gray-01"
            numberOfLines={1}
          >
            {folder.name}
          </Text>
          <Text className="ml-2 text-sm font-bold text-main-green">
            {folder.bookmarkCount ?? folder.places.length}
          </Text>
        </View>
        <Text className="text-[13px] text-gray-02" numberOfLines={1}>
          {folder.description}
        </Text>
      </View>
      {!folder.isDefault ? (
        <View className="flex-row items-center">
          <Pressable
            accessibilityRole="button"
            className="h-9 w-9 items-center justify-center"
            onPress={(event) => {
              event.stopPropagation();
              onEditPress?.(folder);
            }}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={20}
              color="#7D9AAE"
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            className="h-9 w-9 items-center justify-center"
            onPress={(event) => {
              event.stopPropagation();
              onDeletePress?.(folder);
            }}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={20}
              color="#F29B7F"
            />
          </Pressable>
        </View>
      ) : null}
      <MaterialCommunityIcons name="chevron-right" size={22} color="#7D9AAE" />
    </Pressable>
  );
}
