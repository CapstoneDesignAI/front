type IFolderItem = {
  folder_id: string;
  name: string;
  is_default: boolean;
  bookmark_count: number;
};

type IGetFoldersListResponse = IFolderItem[];

type IPostFolderItemRequest = {
  name: string;
};

type IFolderMutationResponse = {
  message: string;
  folder_id?: string;
};

type IPostBookmarkPlace = {
  place_id: string;
  folder_id: string;
};
