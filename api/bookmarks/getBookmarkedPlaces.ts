import api from "@/_lib/fetcher";

export default async function getBookmarkedPlaces(
  accessToken: string,
  folderId?: string,
) {
  const queryString = folderId
    ? `?folder_id=${encodeURIComponent(folderId)}`
    : "";
  const data = await api.get<IGetBookmarkedPlacesResponse>({
    endpoint: `/bookmarks${queryString}`,
    authorization: accessToken,
  });

  return data;
}
