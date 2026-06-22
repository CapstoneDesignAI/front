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

type IKakaoPlacePayload = {
  kakao_place_id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  category: string;
};

type IPostBookmarkRequest = {
  place?: IKakaoPlacePayload;
  place_id?: string;
  folder_id?: string;
};

type IPostBookmarkResponse = {
  message: string;
  bookmark_id: string;
  place_id: string;
  is_newly_created_place: boolean;
};

type IBookmarkMutationResponse = {
  message: string;
};

type IBookmarkedPlaceItem = {
  bookmark_id: string;
  folder_id: string;
  place_id: string;
  name: string;
  address: string;
  image_url?: string | null;
  category: string;
  latitude?: number | null;
  longitude?: number | null;
};

type IGetBookmarkedPlacesResponse = IBookmarkedPlaceItem[];
