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

  return uri.split("/").pop() || "upload.jpg";
};

export default async function postImageUpload(
  accessToken: string,
  imageUri: string,
) {
  const formData = new FormData();
  formData.append("image", {
    uri: imageUri,
    name: getImageName(imageUri),
    type: getImageType(imageUri),
  } as unknown as Blob);

  const data = await api.post<FormData, IPostImageUploadResponse>({
    endpoint: "/images/upload",
    body: formData,
    authorization: accessToken,
  });

  return data;
}
