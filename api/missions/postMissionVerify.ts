import api from "@/_lib/fetcher";

export default async function postMissionVerify(
  accessToken: string,
  mission_id: string,
  body: IPostMissionVerifyRequest,
) {
  const data = await api.post<IPostMissionVerifyRequest, IPostMissionVerifyResponse>({
    endpoint: `/missions/${mission_id}/verify`,
    body,
    authorization: accessToken,
  });
  return data;
}
