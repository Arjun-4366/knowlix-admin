import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/constants/apiClient";
import { IAboutPayload } from "@/types/about";
import { QueryParams } from "@/types/queryParams";
import { IApiResponse } from "@/types/api";

export const getAbout = async (params?: QueryParams) => {
  const res = await apiClient.get<IApiResponse<IAboutPayload>>(ENDPOINTS.ABOUT, { params });
  return res.data.data;
};

export const createAbout = async (data: IAboutPayload) => {
  const res = await apiClient.post<IApiResponse<IAboutPayload>>(ENDPOINTS.ABOUT_CREATE, data);
  return res.data;
};
