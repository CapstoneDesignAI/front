import api from "@/_lib/fetcher";

const normalizeStamps = (data: unknown): IGetStampsResponse => {
  if (Array.isArray(data)) {
    return data as IGetStampsResponse;
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const record = data as Record<string, unknown>;
  const candidate = record.data ?? record.stamps ?? record.items;

  if (Array.isArray(candidate)) {
    return candidate as IGetStampsResponse;
  }

  return [data as IStampBoardResponse];
};

export default async function getStamps(accessToken: string, regionId?: string) {
  const query = regionId ? `?region_id=${encodeURIComponent(regionId)}` : "";
  const data = await api.get<unknown>({
    endpoint: `/stamps${query}`,
    authorization: accessToken,
  });
  return normalizeStamps(data);
}
