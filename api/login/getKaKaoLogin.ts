import api from "@/_lib/fetcher";

export default async function getKakaoURL() {
  const data = await api.get<IKakaoLoginUrlResponse>({
    endpoint: `/auth/kakao`,
  });
  return data;
}
