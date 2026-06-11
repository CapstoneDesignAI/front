import api from "@/_lib/fetcher";
import { normalizeRecommendation } from "@/api/recommendations/normalizeRecommendation";

export default async function getAIRecommendation(
  authorization: string,
  routeId: string,
) {
  const data = await api.get<unknown>({
    endpoint: `/ai-recommendations/${routeId}`,
    authorization,
  });

  return normalizeRecommendation(data);
}
