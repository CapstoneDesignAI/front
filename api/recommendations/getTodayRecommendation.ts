import api from "@/_lib/fetcher";
import { normalizeNullableRecommendation } from "./normalizeRecommendation";

export default async function getTodayRecommendation(authorization: string) {
  const data = await api.get<unknown>({
    endpoint: "/recommendations/today",
    authorization,
  });

  return normalizeNullableRecommendation(data);
}
