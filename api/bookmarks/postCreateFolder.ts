import api from "@/_lib/fetcher";

export default async function postCreateFolder(
  accessToken: string,
  body: IPostFolderItemRequest,
) {
  const data = await api.post<IPostFolderItemRequest>({
    endpoint: `/folders`,
    body,
    authorization: accessToken,
  });

  return data;
}
