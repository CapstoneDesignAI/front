type IStampBoardResponse = {
  id?: string;
  region_id: string;
  region_name?: string;
  collected_stamps: number;
  total_stamps?: number;
  next_reward_text?: string;
  updated_at?: string;
};

type IGetStampsResponse = IStampBoardResponse[];

type IGetEmblemResponse = {
  emblem_id: string;
  region_id?: string;
  region_name?: string;
  name: string;
  description: string;
  image_url: string;
  unlock_stamp_threshold: number;
  acquired_at: string;
};

type IGetEmblemsResponse = IGetEmblemResponse[];
