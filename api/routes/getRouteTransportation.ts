import api from "@/_lib/fetcher";

export default async function getRouteTransportation(
  authorization: string,
  routeId: string,
) {
  const data = await api.get<IGetRouteTransportationResponse>({
    endpoint: `/routes/${routeId}/transportation`,
    authorization,
  });

  return data;
}
