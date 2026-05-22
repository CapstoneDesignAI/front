import FavoriteFolderItem from "./FavoriteFolderItem";
import type { FavoriteFolder } from "./types";

type FavoriteFolderListProps = {
  folders: FavoriteFolder[];
  onFolderPress: (folderId: number) => void;
};

export default function FavoriteFolderList({
  folders,
  onFolderPress,
}: FavoriteFolderListProps) {
  return folders.map((folder) => (
    <FavoriteFolderItem
      key={folder.id}
      folder={folder}
      onPress={onFolderPress}
    />
  ));
}
