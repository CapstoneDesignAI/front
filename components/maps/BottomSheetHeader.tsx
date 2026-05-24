import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { FavoriteFolder } from "./types";

type BottomSheetHeaderProps = {
  folderCount: number;
  isExpanded: boolean;
  onBackToFolders: () => void;
  onToggle: () => void;
  selectedFolder?: FavoriteFolder;
};

export default function BottomSheetHeader({
  folderCount,
  isExpanded,
  onBackToFolders,
  onToggle,
  selectedFolder,
}: BottomSheetHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-5 pb-3">
      <View className="flex-1">
        {selectedFolder ? (
          <Pressable
            accessibilityRole="button"
            className="mb-1 flex-row items-center gap-1 self-start"
            onPress={onBackToFolders}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={20}
              color="#7D9AAE"
            />
            <Text className="text-sm font-bold text-gray-02">폴더 목록</Text>
          </Pressable>
        ) : null}
        <Text className="mt-0.5 text-[22px] font-extrabold text-gray-01">
          {selectedFolder?.name ?? "즐겨찾기"}
        </Text>
        <Text className="mt-1 text-[13px] text-gray-02">
          {selectedFolder
            ? `${selectedFolder.places.length}개의 저장한 장소`
            : `${folderCount}개의 폴더`}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        className="h-9 w-9 items-center justify-center rounded-full bg-main-04"
        onPress={onToggle}
      >
        <MaterialCommunityIcons
          name={isExpanded ? "chevron-down" : "chevron-up"}
          size={24}
          color="#3A3A3A"
        />
      </Pressable>
    </View>
  );
}
