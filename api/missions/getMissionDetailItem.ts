import api from "@/_lib/fetcher";

interface props {
  accessToken: string;
  mission_id: string;
}

export default async function getMissionDetailItem({
  accessToken,
  mission_id,
}: props) {
  const data = await api.get<IGetMissionDetailItemResponse>({
    endpoint: `/missions/${mission_id}`,
    authorization: accessToken,
  });
  return data;
}
