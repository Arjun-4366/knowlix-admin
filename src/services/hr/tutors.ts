import { apiClient } from "@/constants/apiClient";
import { ENDPOINTS } from "@/constants/endpoints";
import { IApiResponse } from "@/types/admin/api";

// Re-use the tutor type from the existing admin types
export const getTutorsHR = async (params?: { status?: string }) => {
  const res = await apiClient.get<IApiResponse<unknown[]> & { total: number }>(
    ENDPOINTS.GET_TUTORS_HR,
    { params }
  );
  return res.data;
};

export const getTutorHR = async (id: string) => {
  const res = await apiClient.get<IApiResponse<unknown>>(ENDPOINTS.GET_TUTOR_HR(id));
  return res.data;
};

export const createTutorByHR = async (data: Record<string, unknown> | FormData) => {
  const res = await apiClient.post<IApiResponse<unknown>>(ENDPOINTS.CREATE_TUTOR, data);
  return res.data;
};
