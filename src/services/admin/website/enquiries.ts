import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/constants/apiClient";
import { IEnquiry, IEnquiryResponse, EnquiryStatus } from "@/types/admin/enquiry";
import { IApiResponse } from "@/types/admin/api";

export const getEnquiries = async () => {
  const res = await apiClient.get<IEnquiryResponse>(ENDPOINTS.ENQUIRIES_FETCH);
  return res.data;
};

export const updateEnquiryStatus = async (id: string, status: EnquiryStatus) => {
  const res = await apiClient.put<IApiResponse<null>>(`${ENDPOINTS.ENQUIRIES_UPDATE}/${id}`, { status });
  return res.data;
};

export const deleteEnquiry = async (id: string) => {
  const res = await apiClient.delete<IApiResponse<null>>(`${ENDPOINTS.ENQUIRIES_DELETE}/${id}`);
  return res.data;
};
