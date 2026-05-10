import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/constants/apiClient";
import { IFaq, IFaqResponse } from "@/types/faq";
import { IApiResponse } from "@/types/api";

export const getFaqs = async () => {
  const res = await apiClient.get<IFaqResponse>(ENDPOINTS.FAQS_FETCH);
  return res.data;
};

export const createFaq = async (data: IFaq) => {
  const res = await apiClient.post<IApiResponse<IFaq>>(ENDPOINTS.FAQS_CREATE, data);
  return res.data;
};

export const deleteFaq = async (id: string) => {
  const res = await apiClient.delete<IApiResponse<null>>(`${ENDPOINTS.FAQS_DELETE}/${id}`);
  return res.data;
};
