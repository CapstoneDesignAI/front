type AIRecommendationDuration =
  | "1~2시간"
  | "반나절"
  | "하루"
  | "1박2일"
  | "2박3일"
  | "기타";

type AIRecommendationTransportation = "대중교통" | "자차" | "자전거" | "도보";

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
