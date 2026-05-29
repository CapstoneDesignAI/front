import FavoriteFolderItem from "./FavoriteFolderItem";

type FavoriteFolderListProps = {
  folders: IFolderItem[];
  onDeleteFolder?: (folder: IFolderItem) => void;
  onEditFolder?: (folder: IFolderItem) => void;
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
      key={folder.folder_id}
      folder={folder}
      onPress={onFolderPress}
    />
  ));
}
