import api from "@/_lib/fetcher";

const unwrapAIRecommendation = (data: unknown): IPostAIRecommendationResponse => {
  if (data && typeof data === "object" && "title" in data && "places" in data) {
    return data as IPostAIRecommendationResponse;
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const candidate = record.data ?? record.recommendation ?? record.route;

    if (candidate && typeof candidate === "object") {
      return candidate as IPostAIRecommendationResponse;
    }
  }

  return data as IPostAIRecommendationResponse;
};

export default async function getAIRecommendation(
  authorization: string,
  routeId: string,
) {
  const data = await api.get<unknown>({
    endpoint: `/ai-recommendations/${routeId}`,
    authorization,
  });

  return unwrapAIRecommendation(data);
}
