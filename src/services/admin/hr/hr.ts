import { apiClient } from "@/constants/apiClient";
import { ENDPOINTS } from "@/constants/endpoints";
import { QueryParams } from "@/types/queryParams";
import { IApiResponse } from "@/types/admin/api";
import {
  IHrsResponse,
  IHrResponse,
  ICreateHrPayload,
  IUpdateHrPayload,
  IUpdateHrPasswordPayload,
} from "@/types/admin/hr";

export const getHRs = async (params?: QueryParams) => {
  const res = await apiClient.get<IHrsResponse>(ENDPOINTS.ADMIN_HR_FETCH, { params });
  return res.data;
};

export const createHR = async (data: ICreateHrPayload) => {
  const res = await apiClient.post<IHrResponse>(ENDPOINTS.ADMIN_HR_CREATE, data);
  return res.data;
};

export const updateHR = async (id: string, data: IUpdateHrPayload) => {
  const res = await apiClient.put<IHrResponse>(ENDPOINTS.ADMIN_HR_UPDATE(id), data);
  return res.data;
};

export const updateHRPassword = async (id: string, data: IUpdateHrPasswordPayload) => {
  const res = await apiClient.put<IHrResponse>(ENDPOINTS.ADMIN_HR_UPDATE_PASSWORD(id), data);
  return res.data;
};

export const deleteHR = async (id: string) => {
  const res = await apiClient.delete<IApiResponse<null>>(ENDPOINTS.ADMIN_HR_DELETE(id));
  return res.data;
};
