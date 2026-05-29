import api from "@/_lib/fetcher";

export default async function deleteFolder(
  accessToken: string,
  folder_id: string,
) {
  const data = await api.delete<IFolderMutationResponse>({
    endpoint: `/folders/${folder_id}`,
    authorization: accessToken,
  });

  return data;
}
