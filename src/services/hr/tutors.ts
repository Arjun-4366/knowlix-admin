import { apiClient } from "@/constants/apiClient";
import { ENDPOINTS } from "@/constants/endpoints";
import { IApiResponse } from "@/types/admin/api";
import { ICreateTutorPayload, ITutor, IUpdateTutorPayload } from "@/types/admin/tutor";

// Password and status are excluded from HR tutor updates
export type IUpdateTutorHRPayload = Omit<IUpdateTutorPayload, "password" | "status">;

export interface ITutorHRQueryParams {
  search?: string;
  status?: string;
  syllabus?: string;
  availability?: string;
  page?: number;
  limit?: number;
}

export interface ITutorsHRResponse {
  data: ITutor[];
  total: number;
  status: string;
}

export const getTutorsHR = async (params?: ITutorHRQueryParams): Promise<ITutorsHRResponse> => {
  const res = await apiClient.get<ITutorsHRResponse>(ENDPOINTS.GET_TUTORS_HR, { params });
  return res.data;
};

export const updateTutorHR = async (id: string, data: IUpdateTutorHRPayload) => {
  const res = await apiClient.put<IApiResponse<ITutor>>(ENDPOINTS.UPDATE_TUTOR_HR(id), data);
  return res.data;
};

export const getTutorHR = async (id: string) => {
  const res = await apiClient.get<IApiResponse<ITutor>>(ENDPOINTS.GET_TUTOR_HR(id));
  return res.data;
};

export const createTutorByHR = async (data: ICreateTutorPayload) => {
  const res = await apiClient.post<IApiResponse<ITutor>>(ENDPOINTS.CREATE_TUTOR, data);
  return res.data;
};

export interface IAddRemarkPayload {
  type: "positive" | "negative";
  text: string;
}

export const addRemarkHR = async (id: string, data: IAddRemarkPayload) => {
  const res = await apiClient.post<IApiResponse<ITutor>>(ENDPOINTS.ADD_REMARK_HR(id), data);
  return res.data;
};
