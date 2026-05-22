import api from "@/_lib/fetcher";

export interface IUserProfileResponse {
  id: string;
  email: string;
  nickName: string;
  profile_img: string | null;
}

export default async function getUserProfile(accessToken: string) {
  const data = await api.get<IUserProfileResponse>({
    endpoint: "/user/profile",
    authorization: accessToken,
  });

  return data;
}
