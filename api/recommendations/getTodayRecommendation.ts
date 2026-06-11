import api from "@/_lib/fetcher";

const unwrapTodayRecommendation = (
  data: unknown,
): IPostAIRecommendationResponse | null => {
  if (!data || typeof data !== "object") {
    return null;
  }

  if ("title" in data && "places" in data) {
    return data as IPostAIRecommendationResponse;
  }

  const record = data as Record<string, unknown>;
  const candidate =
    record.data ?? record.recommendation ?? record.today_recommendation;

  if (candidate && typeof candidate === "object") {
    return candidate as IPostAIRecommendationResponse;
  }

  return null;
};

export default async function getTodayRecommendation(authorization: string) {
  const data = await api.get<unknown>({
    endpoint: "/recommendations/today",
    authorization,
  });

  return unwrapTodayRecommendation(data);
}
