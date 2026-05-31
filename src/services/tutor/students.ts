import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/constants/apiClient";
import { QueryParams } from "@/types/queryParams";
import { IApiResponse } from "@/types/admin/api";
import { IStudent } from "@/types/admin/student";

export interface ITutorStudentsResponse extends IApiResponse<IStudent[]> {
  total: number;
}

export const getTutorStudents = async (params?: QueryParams) => {
  const res = await apiClient.get<ITutorStudentsResponse>(ENDPOINTS.GET_TUTOR_STUDENTS, { params });
  return res.data;
};

export const getTutorStudent = async (id: string) => {
  const res = await apiClient.get<IApiResponse<IStudent>>(ENDPOINTS.GET_TUTOR_STUDENT(id));
  return res.data.data;
};

