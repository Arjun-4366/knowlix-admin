import { apiClient } from "@/constants/apiClient";
import { ENDPOINTS } from "@/constants/endpoints";
import { QueryParams } from "@/types/queryParams";
import { IApiResponse } from "@/types/admin/api";
import {
  ICreateCoordinatorPayload,
  ICoordinator,
  ICoordinatorResponse,
  ICoordinatorsResponse,
  IUpdateCoordinatorPayload,
} from "@/types/admin/coordinator";

export const getCoordinators = async (params?: QueryParams) => {
  const res = await apiClient.get<ICoordinatorsResponse>(ENDPOINTS.GET_COORDINATORS, { params });
  return res.data;
};

export const createCoordinator = async (data: ICreateCoordinatorPayload) => {
  const res = await apiClient.post<ICoordinatorResponse>(ENDPOINTS.CREATE_COORDINATOR, data);
  return res.data;
};

export const updateCoordinator = async (id: string, data: IUpdateCoordinatorPayload) => {
  const res = await apiClient.put<ICoordinatorResponse>(ENDPOINTS.UPDATE_COORDINATOR(id), data);
  return res.data;
};

export const deleteCoordinator = async (id: string) => {
  const res = await apiClient.delete<IApiResponse<null>>(ENDPOINTS.DELETE_COORDINATOR(id));
  return res.data;
};
