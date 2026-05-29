import api from "@/_lib/fetcher";

export default async function postAIRecommendation(
  authorization: string,
  body: IPostAIRecommendationRequest,
) {
  const data = await api.post<
    IPostAIRecommendationRequest,
    IPostAIRecommendationResponse
  >({
    endpoint: `/ai-recommendations`,
    body,
    authorization,
  });

  return data;
}
