import api from "@/_lib/fetcher";

export default async function postBookmark(
  accessToken: string,
  body: IPostBookmarkRequest,
) {
  const data = await api.post<IPostBookmarkRequest, IPostBookmarkResponse>({
    endpoint: "/bookmarks",
    body,
    authorization: accessToken,
  });

  return data;
}
