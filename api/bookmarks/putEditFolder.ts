import api from "@/_lib/fetcher";

export default async function postCreateFolder(
  accessToken: string,
  body: IPostFolderItemRequest,
  folder_id: string,
) {
  const data = await api.put<IPostFolderItemRequest>({
    endpoint: `/folders${folder_id}`,
    body,
    authorization: accessToken,
  });

  return data;
}
