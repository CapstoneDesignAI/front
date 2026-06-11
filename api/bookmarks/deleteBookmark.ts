import api from "@/_lib/fetcher";

export default async function deleteBookmark(
  accessToken: string,
  placeId: string,
) {
  const data = await api.delete<IBookmarkMutationResponse>({
    endpoint: `/bookmarks/${encodeURIComponent(placeId)}`,
    authorization: accessToken,
  });

  return data;
}
