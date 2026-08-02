import { apiClient } from "@/constants/apiClient";
import { ENDPOINTS } from "@/constants/endpoints";
import { IApiResponse } from "@/types/admin/api";
import {
  ICreateTimetablePayload,
  ITimetableQueryParams,
  ITimetableResponse,
  IUpdateTimetablePayload,
} from "@/types/admin/timetable";

export const getTimetable = async (params?: ITimetableQueryParams) => {
  const res = await apiClient.get<ITimetableResponse>(ENDPOINTS.GET_TIMETABLE, { params });
  return res.data;
};

export const createTimetable = async (data: ICreateTimetablePayload) => {
  const res = await apiClient.post(ENDPOINTS.CREATE_TIMETABLE, data);
  return res.data;
};

export const updateTimetable = async (id: string, data: IUpdateTimetablePayload) => {
  const res = await apiClient.put(ENDPOINTS.UPDATE_TIMETABLE(id), data);
  return res.data;
};

export const deleteTimetable = async (id: string) => {
  const res = await apiClient.delete<IApiResponse<null>>(ENDPOINTS.DELETE_TIMETABLE(id));
  return res.data;
};
