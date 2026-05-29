type IFoldersListItem = {
  folder_id: string;
  name: string;
  is_default: boolean;
  bookmark_count: number;
};

type IGetFoldersListResponse = IFoldersListItem[];

type IPostFolderItemRequest = {
  name: string;
};

type IPostBookmarkPlace = {
  place_id: string;
  folder_id: string;
};
