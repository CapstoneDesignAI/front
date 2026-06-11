import api from "@/_lib/fetcher";

export default async function getBookmarkedPlaces(
  accessToken: string,
  folderId: string,
) {
  const data = await api.get<IGetBookmarkedPlacesResponse>({
    endpoint: `/bookmarks?folder_id=${encodeURIComponent(folderId)}`,
    authorization: accessToken,
  });

  return data;
}
