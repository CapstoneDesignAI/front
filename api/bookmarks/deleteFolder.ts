import api from "@/_lib/fetcher";

interface Res {
  message: string;
}

export default async function postCreateFolder(
  accessToken: string,
  folder_id: string,
) {
  const data = await api.delete<Res>({
    endpoint: `/folders${folder_id}`,
    authorization: accessToken,
  });

  return data;
}
