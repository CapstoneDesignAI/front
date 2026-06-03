import api from "@/_lib/fetcher";

export default async function getMissionsList(
  accessToken: string,
  region_id: string,
) {
  const data = await api.get<IGetMissionListResponse>({
    endpoint: `/missions/${region_id}`,
    authorization: accessToken,
  });
  return data;
}
