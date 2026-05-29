import api from "@/_lib/fetcher";

export default async function getUserProfile(accessToken: string) {
  const data = await api.get<IUserProfileResponse>({
    endpoint: "/user/profile",
    authorization: accessToken,
  });

  return data;
}
