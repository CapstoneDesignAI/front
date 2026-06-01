import api from "@/_lib/fetcher";

export default async function getStamps(accessToken: string, region_id: string) {
  const data = await api.get<IGetStampsResponse>({
    endpoint: `/stamps/${region_id}`,
    authorization: accessToken,
  });
  return data;
}
