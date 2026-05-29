import api from "@/_lib/fetcher";

export default async function getBookmarkFolders(accessToken: string) {
  const data = await api.get<IGetFoldersListResponse>({
    endpoint: `/folders`,
    authorization: accessToken,
  });
  return data;
}
