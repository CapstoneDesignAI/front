import api from "@/_lib/fetcher";

export default async function getMissionDetailItem(
  accessToken: string,
  mission_id: string,
) {
  const data = await api.get<IGetMissionDetailItemResponse>({
    endpoint: `/missions/${mission_id}`,
    authorization: accessToken,
  });
  return data;
}
