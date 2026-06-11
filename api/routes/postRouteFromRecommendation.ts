import api from "@/_lib/fetcher";

export default async function postRouteFromRecommendation(
  authorization: string,
  routeId: string,
) {
  const data = await api.post<
    ISaveRouteFromRecommendationRequest,
    ISaveRouteFromRecommendationResponse
  >({
    endpoint: "/routes/from-recommendation",
    body: { route_id: routeId },
    authorization,
  });

  return data;
}
