import api from "@/_lib/fetcher";

interface props {
  accessToken: string;
  mission_id: string;
  body: IPostMissionVerifyRequest;
}

export default async function getMissionDetailItem({
  accessToken,
  mission_id,
  body,
}: props) {
  const data = await api.post<
    IPostMissionVerifyRequest,
    IPostMissionVerifyResponse
  >({
    endpoint: `/missions/${mission_id}/verify`,
    body,
    authorization: accessToken,
  });
  return data;
}
