import api from "@/_lib/fetcher";

export default async function getEmblems(accessToken: string, regionId?: string) {
  const query = regionId ? `?region_id=${encodeURIComponent(regionId)}` : "";
  const data = await api.get<IGetEmblemsResponse>({
    endpoint: `/emblems${query}`,
    authorization: accessToken,
  });
  return data;
}
