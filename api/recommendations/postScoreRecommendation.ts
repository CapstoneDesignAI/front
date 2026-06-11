import api from "@/_lib/fetcher";
import { normalizeRecommendation } from "./normalizeRecommendation";

export default async function postScoreRecommendation(
  body: IScoreRecommendationRequest,
) {
  const data = await api.post<IScoreRecommendationRequest, unknown>({
    endpoint: "/recommendations",
    body,
  });

  return normalizeRecommendation(data);
}
