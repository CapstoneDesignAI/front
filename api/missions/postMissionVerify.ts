import api from "@/_lib/fetcher";

const getImageType = (uri: string, type?: string | null) => {
  if (type) {
    return type;
  }

  const extension = uri.split(".").pop()?.toLowerCase();

  if (extension === "png") {
    return "image/png";
  }

  if (extension === "webp") {
    return "image/webp";
  }

  if (extension === "heic") {
    return "image/heic";
  }

  if (extension === "heif") {
    return "image/heif";
  }

  return "image/jpeg";
};

const getImageName = (uri: string, name?: string | null) => {
  if (name) {
    return name;
  }

  return uri.split("/").pop() || "mission-verification.jpg";
};

export default async function postMissionVerify(
  accessToken: string,
  mission_id: string,
  body: IPostMissionVerifyRequest,
) {
  const formData = new FormData();
  formData.append("latitude", String(body.latitude));
  formData.append("longitude", String(body.longitude));
  formData.append("image", {
    uri: body.image.uri,
    name: getImageName(body.image.uri, body.image.name),
    type: getImageType(body.image.uri, body.image.type),
  } as unknown as Blob);

  const data = await api.post<FormData, IPostMissionVerifyResponse>({
    endpoint: `/missions/${mission_id}/verify`,
    body: formData,
    authorization: accessToken,
  });
  return data;
}
