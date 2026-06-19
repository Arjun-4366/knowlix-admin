import { apiClient } from "@/constants/apiClient";
import { ENDPOINTS } from "@/constants/endpoints";
import {
  IHRPerformancePayload,
  IHRPerformanceListResponse,
  IHRGrowthLeaderboardResponse,
} from "@/types/admin/hr";
import { IApiResponse } from "@/types/admin/api";

export const createHRPerformance = async (data: IHRPerformancePayload) => {
  const res = await apiClient.post<IApiResponse<any>>(ENDPOINTS.HR_GROWTH_AWARD, [data]);
  return res.data;
};

export const getHRPerformanceHistory = async (params?: { tutorId?: string; month?: string; year?: number }) => {
  const res = await apiClient.get<IHRPerformanceListResponse>(ENDPOINTS.HR_GROWTH_HISTORY, { params });
  return res.data;
};

export const updateHRPerformance = async (id: string, data: IHRPerformancePayload) => {
  const res = await apiClient.put<IApiResponse<null>>(ENDPOINTS.UPDATE_PERFORMANCE(id), data);
  return res.data;
};

export const getHRGrowthLeaderboard = async () => {
  const res = await apiClient.get<IHRGrowthLeaderboardResponse>(ENDPOINTS.HR_GROWTH_LEADERBOARD);
  return res.data;
};
