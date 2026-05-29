import FavoriteFolderItem from "./FavoriteFolderItem";
import type { FavoriteFolder } from "./types";

type FavoriteFolderListProps = {
  folders: FavoriteFolder[];
  onDeleteFolder?: (folder: FavoriteFolder) => void;
  onEditFolder?: (folder: FavoriteFolder) => void;
  onFolderPress: (folderId: string) => void;
};

export default function FavoriteFolderList({
  folders,
  onDeleteFolder,
  onEditFolder,
  onFolderPress,
}: FavoriteFolderListProps) {
  return folders.map((folder) => (
    <FavoriteFolderItem
      key={folder.id}
      folder={folder}
      onDeletePress={onDeleteFolder}
      onEditPress={onEditFolder}
      onPress={onFolderPress}
    />
  ));
}
