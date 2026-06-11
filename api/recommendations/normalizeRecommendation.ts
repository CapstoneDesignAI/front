const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isRecommendation = (
  value: unknown,
): value is IPostAIRecommendationResponse =>
  isRecord(value) && "title" in value;

const mapPreviewToPlace = (place: IRecommendationPlacePreview): IPlaceItem => ({
  order: place.order,
  visit_order: place.order,
  place_id: place.place_id,
  name: place.name,
  category: place.category,
  address: "",
  lat: place.lat,
  lng: place.lng,
  reason: place.summary,
  description: place.summary,
  tags: place.tags,
  image_url: place.image_url,
  is_local_consumption: place.is_local_consumption,
});

const buildFromCard = (
  card: IRecommendationCard,
): IPostAIRecommendationResponse => ({
  recommendation_id: card.recommendation_id,
  route_id: card.route_id,
  title: card.title,
  subtitle: card.subtitle,
  sido: card.sido,
  sigungu: card.sigungu,
  region_story: card.region_story,
  theme_label: card.theme_label,
  contribution_score: card.contribution_score,
  contribution_info: card.contribution_info,
  local_consumption_points: card.local_consumption_points,
  place_count: card.place_count,
  ai_reason: card.ai_reason_summary ?? card.summary,
  total_distance_text: card.route_preview_text,
  mobility: card.mobility,
  card,
  places: card.place_preview?.map(mapPreviewToPlace) ?? [],
});

export const normalizeRecommendation = (
  data: unknown,
): IPostAIRecommendationResponse => {
  if (isRecommendation(data) && Array.isArray(data.places)) {
    return data;
  }

  if (!isRecord(data)) {
    return data as IPostAIRecommendationResponse;
  }

  const record = data as {
    card?: IRecommendationCard;
    data?: unknown;
    recommendation?: unknown;
    route?: unknown;
    today_recommendation?: unknown;
    today_date?: string;
    section_title?: string;
    recommendation_id?: string;
    route_id?: string;
    detail_api_path?: string;
    save_api_path?: string;
  };

  const candidate = record.data ?? record.recommendation ?? record.route;

  if (isRecommendation(candidate)) {
    return {
      ...candidate,
      recommendation_id:
        candidate.recommendation_id ?? record.recommendation_id,
      route_id: candidate.route_id ?? record.route_id,
      card: candidate.card ?? record.card,
      today_date: record.today_date,
      section_title: record.section_title,
      detail_api_path: record.detail_api_path,
      save_api_path: record.save_api_path,
      places:
        candidate.places ??
        candidate.card?.place_preview?.map(mapPreviewToPlace) ??
        record.card?.place_preview?.map(mapPreviewToPlace) ??
        [],
    };
  }

  if (isRecommendation(record.today_recommendation)) {
    return normalizeRecommendation({
      ...record,
      recommendation: record.today_recommendation,
    });
  }

  if (record.card) {
    return {
      ...buildFromCard(record.card),
      recommendation_id:
        record.recommendation_id ?? record.card.recommendation_id,
      route_id: record.route_id ?? record.card.route_id,
      today_date: record.today_date,
      section_title: record.section_title,
      detail_api_path: record.detail_api_path,
      save_api_path: record.save_api_path,
    };
  }

  return data as unknown as IPostAIRecommendationResponse;
};

export const normalizeNullableRecommendation = (
  data: unknown,
): IPostAIRecommendationResponse | null => {
  if (!data) {
    return null;
  }

  return normalizeRecommendation(data);
};
