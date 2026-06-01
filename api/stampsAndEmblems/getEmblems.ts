import api from "@/_lib/fetcher";

interface props {
  accessToken: string;
}

export default async function getStamps({ accessToken }: props) {
  const data = await api.get<IGetEmblemResponse>({
    endpoint: `/emblems`,
    authorization: accessToken,
  });
  return data;
}
