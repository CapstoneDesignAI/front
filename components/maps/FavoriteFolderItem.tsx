import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type FavoriteFolderItemProps = {
  folder: IFolderItem;
  onDeletePress?: (folder: IFolderItem) => void;
  onEditPress?: (folder: IFolderItem) => void;
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
      onPress={() => onPress(folder.folder_id)}
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
            {folder.bookmark_count}
          </Text>
        </View>
        <Text className="text-[13px] text-gray-02" numberOfLines={1}>
          {folder.is_default ? "기본 폴더" : "사용자 폴더"}
        </Text>
      </View>
      {!folder.is_default ? (
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
