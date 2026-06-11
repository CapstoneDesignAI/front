import api from "@/_lib/fetcher";

const unwrapRoute = (data: unknown): IRouteRecommendation => {
  if (data && typeof data === "object" && "title" in data && "places" in data) {
    return data as IRouteRecommendation;
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const candidate = record.data ?? record.route;

    if (candidate && typeof candidate === "object") {
      return candidate as IRouteRecommendation;
    }
  }

  return data as IRouteRecommendation;
};

export default async function getRoute(authorization: string, routeId: string) {
  const data = await api.get<unknown>({
    endpoint: `/routes/${routeId}`,
    authorization,
  });

  return unwrapRoute(data);
}
