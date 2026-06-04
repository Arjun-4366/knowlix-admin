import { apiClient } from "@/constants/apiClient";
import { ENDPOINTS } from "@/constants/endpoints";
import {
  ICreateHRNoticePayload,
  IHRNoticeQueryParams,
  IHRNoticeResponse,
  IHRNoticesResponse,
} from "@/types/admin/hr";
import { IApiResponse } from "@/types/admin/api";

export const createHRNotice = async (data: ICreateHRNoticePayload) => {
  const res = await apiClient.post<IHRNoticeResponse>(ENDPOINTS.CREATE_NOTICE, data);
  return res.data;
};

export const getHRNotices = async (params?: IHRNoticeQueryParams) => {
  const res = await apiClient.get<IHRNoticesResponse>(ENDPOINTS.GET_NOTICES, { params });
  return res.data;
};

export const updateHRNotice = async (id: string, data: Partial<ICreateHRNoticePayload>) => {
  const res = await apiClient.put<IHRNoticeResponse>(ENDPOINTS.UPDATE_NOTICE(id), data);
  return res.data;
};

export const deleteHRNotice = async (id: string) => {
  const res = await apiClient.delete<IApiResponse<null>>(ENDPOINTS.DELETE_NOTICE(id));
  return res.data;
};
