type IGetMissionDetailItemResponse = {
  mission_id: string;
  title: string;
  condition: string;
  stamp_count: number;
  place_name: string;
  distance_text: string;
};

type IGetMissionItemResponse = {
  mission_id: string;
  title: string;
  stamp_count: number;
  difficulty: string;
  is_completed: boolean;
};

type IGetMissionListResponse = IGetMissionItemResponse[];

type IPostMissionVerifyRequest = {
  latitude: number;
  longitude: number;
  image_url: string;
};

type IPostImageUploadResponse = {
  image_url: string;
};

type IPostMissionVerifyResponse = {
  message: string;
  user_mission_id: string;
  status: string;
};
