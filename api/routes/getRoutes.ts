import api from "@/_lib/fetcher";

const unwrapRoutes = (data: unknown): IRouteRecommendation[] => {
  if (Array.isArray(data)) {
    return data as IRouteRecommendation[];
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const record = data as Record<string, unknown>;
  const candidate = record.data ?? record.routes ?? record.items;

  return Array.isArray(candidate) ? (candidate as IRouteRecommendation[]) : [];
};

export default async function getRoutes(authorization: string) {
  const data = await api.get<unknown>({
    endpoint: "/routes",
    authorization,
  });

  return unwrapRoutes(data);
}
