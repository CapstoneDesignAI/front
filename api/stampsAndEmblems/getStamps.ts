import api from "@/_lib/fetcher";

interface props {
  accessToken: string;
  region_id: string;
}

export default async function getStamps({ accessToken, region_id }: props) {
  const data = await api.get<IGetStampsResponse>({
    endpoint: `/stamps/${region_id}`,
    authorization: accessToken,
  });
  return data;
}
