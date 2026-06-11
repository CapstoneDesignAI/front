import api from "@/_lib/fetcher";

export default async function deleteRoute(
  authorization: string,
  routeId: string,
) {
  const data = await api.delete<{ message?: string }>({
    endpoint: `/routes/${routeId}`,
    authorization,
  });

  return data;
}
