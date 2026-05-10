import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/constants/apiClient";
import { IReview, IReviewResponse } from "@/types/review";
import { IApiResponse } from "@/types/api";

export const getReviews = async () => {
  const res = await apiClient.get<IReviewResponse>(ENDPOINTS.REVIEWS_FETCH);
  return res.data;
};

export const createReview = async (data: IReview) => {
  const res = await apiClient.post<IApiResponse<IReview>>(ENDPOINTS.REVIEWS_CREATE, data);
  return res.data;
};

export const deleteReview = async (id: string) => {
  const res = await apiClient.delete<IApiResponse<null>>(`${ENDPOINTS.REVIEWS_DELETE}/${id}`);
  return res.data;
};
