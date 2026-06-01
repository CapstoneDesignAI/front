import api from "@/_lib/fetcher";

export default async function getEmblems(accessToken: string) {
  const data = await api.get<IGetEmblemsResponse>({
    endpoint: `/emblems`,
    authorization: accessToken,
  });
  return data;
}
