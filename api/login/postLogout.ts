import api from "@/_lib/fetcher";

interface LogoutResponse {
  message: string;
}

export default function postLogout(accessToken: string) {
  return api.post<never, LogoutResponse>({
    endpoint: "/auth/logout",
    authorization: accessToken,
  });
}
