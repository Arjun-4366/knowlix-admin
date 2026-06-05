import { apiClient } from "@/constants/apiClient";
import { ENDPOINTS } from "@/constants/endpoints";
import { QueryParams } from "@/types/queryParams";
import { IApiResponse } from "@/types/admin/api";
import {
  ICreateMentorPayload,
  IMentor,
  IMentorResponse,
  IMentorsResponse,
  IUpdateMentorPayload,
} from "@/types/admin/mentor";

export const getMentors = async (params?: QueryParams) => {
  const res = await apiClient.get<IMentorsResponse>(ENDPOINTS.GET_MENTORS, { params });
  return res.data;
};

export const createMentor = async (data: ICreateMentorPayload) => {
  const res = await apiClient.post<IMentorResponse>(ENDPOINTS.CREATE_MENTOR, data);
  return res.data;
};

export const updateMentor = async (id: string, data: IUpdateMentorPayload) => {
  const res = await apiClient.put<IMentorResponse>(ENDPOINTS.UPDATE_MENTOR(id), data);
  return res.data;
};

export const deleteMentor = async (id: string) => {
  const res = await apiClient.delete<IApiResponse<null>>(ENDPOINTS.DELETE_MENTOR(id));
  return res.data;
};
