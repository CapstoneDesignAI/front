import api from "@/_lib/fetcher";
import { normalizeRecommendation } from "@/api/recommendations/normalizeRecommendation";

export default async function postAIRecommendation(
  authorization: string,
  body: IPostAIRecommendationRequest,
) {
  const data = await api.post<
    IPostAIRecommendationRequest,
    unknown
  >({
    endpoint: `/ai-recommendations`,
    body,
    authorization,
  });

  return normalizeRecommendation(data);
}
