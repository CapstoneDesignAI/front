interface IPostAIRecommendationRequest {
  duration_hours: number;
  transportation: string;
  atmosphere: string | null;
  activity_style: string | null;
  travel_purpose: string;
  region: string | null;
  start_location: string;
  companion: string;
}

interface IPostAIRecommendationResponse {
  title: string;
  estimated_time: string;
  places: IPlaceItem[];
}

interface IPlaceItem {
  visit_order: number;
  name: string;
  address: string;
  description: string;
}
