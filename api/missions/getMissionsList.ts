import api from "@/_lib/fetcher";

interface props {
  accessToken: string;
  region_id: string;
}

export default async function getMissionsList({
  accessToken,
  region_id,
}: props) {
  const data = await api.get<IGetMissionListResponse>({
    endpoint: `/missions/${region_id}`,
    authorization: accessToken,
  });
  return data;
}
