type IGetStampsResponse = {
  region_id: string;
  collected_stamps: number;
  total_stamps: number;
  next_reward_text: string;
};

type IGetEmblemResponse = {
  emblem_id: string;
  name: string;
  description: string;
  image_url: string;
  unlock_stamp_threshold: number;
  acquired_at: string;
};

type IGetEmblemsResponse = IGetEmblemResponse[];
