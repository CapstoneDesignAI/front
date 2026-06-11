type AIRecommendationDuration =
  | "1~2시간"
  | "반나절"
  | "하루"
  | "1박2일"
  | "2박3일"
  | "기타";

type AIRecommendationTransportation =
  | "대중교통"
  | "자차"
  | "자전거"
  | "도보"
  | "뚜벅이";

type AIRecommendationTravelPurpose =
  | "힐링"
  | "데이트"
  | "인스타감성"
  | "자연/풍경"
  | "현지경험"
  | "역사/문화";

type AIRecommendationCompanion =
  | "혼자"
  | "친구"
  | "연인"
  | "가족"
  | "부모님"
  | "아이와 함께"
  | "반려동물과 함께"
  | "동아리/단체";

type AIRecommendationAtmosphere =
  | "조용한"
  | "감성적인"
  | "활기찬"
  | "로컬 느낌"
  | "힙한 분위기";

type AIRecommendationActivityStyle = "액티비티/활동적" | "정적/잔잔함";

interface IPostAIRecommendationRequest {
  duration: AIRecommendationDuration;
  transportation: AIRecommendationTransportation;
  travel_purpose: AIRecommendationTravelPurpose;
  companion: AIRecommendationCompanion;
  atmosphere: AIRecommendationAtmosphere | null;
  activity_style: AIRecommendationActivityStyle | null;
  region: string | null;
}

interface IScoreRecommendationRequest {
  region_id?: string | null;
  area_group?: string | null;
  theme: string;
  travel_time: string;
  transport: string;
  companion: string;
  prefer_ai_region?: boolean;
  data_source?: "sample" | "supabase" | "tour_api" | "db" | "auto" | string;
}

interface IRegionItem {
  id: string;
  area_group: string;
  sido: string;
  sigungu: string;
  is_population_decline: boolean;
}

interface IRegionStory {
  title: string;
  summary: string;
  history: string;
  local_story: string;
  local_tip: string;
  source: string;
}

interface IContributionInfo {
  score: number;
  label: string;
  description: string;
}

interface ILocalConsumptionPoint {
  place_id?: string;
  place_name?: string;
  name?: string;
  reason: string;
}

interface IMobilityInfo {
  level: "low" | "medium" | "high" | string;
  label: string;
  recommended_transport: string;
}

interface IRecommendationSummary {
  contribution_label: string;
  duration_text: string;
  cost_range_text: string;
  local_consumption_text: string;
}

interface IAIReasonDetail {
  overview: string;
  route_design: string;
  local_contribution: string;
  traveler_fit: string;
  closing_tip: string;
  highlights: string[];
  generation_source: string;
}

interface IRecommendationPlacePreview {
  order: number;
  place_id: string;
  name: string;
  category: string;
  summary: string;
  tags: string[];
  image_url?: string | null;
  lat: number;
  lng: number;
  is_local_consumption: boolean;
}

interface IRecommendationCard {
  recommendation_id?: string;
  route_id?: string;
  title: string;
  subtitle?: string;
  summary?: string;
  sido?: string;
  sigungu?: string;
  region_label?: string;
  theme_label?: string;
  region_story?: IRegionStory;
  thumbnail_url?: string | null;
  contribution_score?: number;
  contribution_info?: IContributionInfo;
  estimated_duration_text?: string;
  estimated_cost_text?: string;
  local_consumption_text?: string;
  local_consumption_points?: ILocalConsumptionPoint[];
  mobility?: IMobilityInfo;
  tags?: string[];
  metric_badges?: string[];
  place_count?: number;
  place_count_text?: string;
  place_preview_names?: string[];
  place_preview?: IRecommendationPlacePreview[];
  route_preview_text?: string;
  ai_reason_summary?: string;
}

interface IRouteLeg {
  order: number;
  from_place_id: string;
  from_name: string;
  to_place_id: string;
  to_name: string;
  distance_meters: number;
  distance_km: number;
  distance_text: string;
}

interface IPostAIRecommendationResponse {
  recommendation_id?: string;
  route_id?: string;
  title: string;
  subtitle?: string;
  region?: IRegionItem;
  sido?: string;
  sigungu?: string;
  region_story?: IRegionStory;
  theme?: string;
  theme_label?: string;
  travel_time?: string;
  travel_time_label?: string;
  transport?: string;
  transport_label?: string;
  companion?: string;
  companion_label?: string;
  contribution_score?: number;
  contribution_info?: IContributionInfo;
  estimated_duration_minutes?: number;
  estimated_cost_min?: number;
  estimated_cost_max?: number;
  local_consumption_count?: number;
  local_consumption_points?: ILocalConsumptionPoint[];
  place_count?: number;
  total_stay_minutes?: number;
  total_distance_meters?: number;
  total_distance_km?: number;
  ai_reason?: string;
  ai_reason_detail?: IAIReasonDetail;
  total_distance_text?: string;
  estimated_time?: string;
  mobility?: IMobilityInfo;
  route_badges?: string[];
  summary?: IRecommendationSummary;
  card?: IRecommendationCard;
  route_legs?: IRouteLeg[];
  source?: string;
  is_saved?: boolean;
  today_date?: string;
  section_title?: string;
  detail_api_path?: string;
  save_api_path?: string;
  created_at?: string;
  description?: string | null;
  tags?: string[];
  places: IPlaceItem[];
}

type IRouteRecommendation = IPostAIRecommendationResponse & {
  id?: string;
  place_count?: number;
  image_url?: string | null;
  saved_at?: string;
  created_at?: string;
  updated_at?: string;
  description?: string | null;
  tags?: string[];
  image_url?: string | null;
};

interface ISaveRouteFromRecommendationRequest {
  route_id: string;
}

interface ISaveRouteFromRecommendationResponse {
  route_id?: string;
  id?: string;
  message?: string;
}

interface IPlaceItem {
  order?: number;
  visit_order?: number;
  place_id?: string;
  name: string;
  category?: string;
  address: string;
  lat?: number;
  lng?: number;
  stay_minutes?: number;
  reason?: string;
  description?: string;
  contribution_reason?: string;
  place_story?: string;
  local_tip?: string;
  image_url?: string | null;
  estimated_cost_min?: number;
  estimated_cost_max?: number;
  local_contribution_score?: number;
  tags?: string[];
  distance_from_previous_meters?: number | null;
  distance_from_previous_km?: number | null;
  distance_from_previous_text?: string | null;
  is_local_consumption?: boolean;
  recommendation_score?: number;
  score_reasons?: string[];
  source?: string;
}

interface IRouteTransportationItem {
  start: string;
  arrival: string;
  transferTimeText?: string;
  transferCount?: number;
  payment?: number;
  transport?: string;
  distance?: string;
  detailText?: string;
}

interface IGetRouteTransportationResponse {
  available: boolean;
  title?: string;
  totalTimeText?: string;
  summaryText?: string;
  firstStart?: string;
  lastArrival?: string;
  items?: IRouteTransportationItem[];
  segments?: IRouteTransportationItem[];
  routes?: IRouteTransportationItem[];
  details?: IRouteTransportationItem[];
}
