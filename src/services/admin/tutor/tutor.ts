import { apiClient } from "@/constants/apiClient";
import { ENDPOINTS } from "@/constants/endpoints";
import { QueryParams } from "@/types/queryParams";
import { IApiResponse } from "@/types/admin/api";
import {
  ICreateTutorPayload,
  ITutor,
  ITutorResponse,
  ITutorsResponse,
  IUpdateTutorPayload,
  ITutorPermissions,
  IAwardGrowthPointsPayload,
  ILeaderboardResponse,
} from "@/types/admin/tutor";

export const getTutors = async (params?: QueryParams) => {
  const res = await apiClient.get<ITutorsResponse>(ENDPOINTS.GET_TUTORS, { params });
  return res.data;
};

export const getTutor = async (id: string) => {
  const res = await apiClient.get<ITutorResponse>(ENDPOINTS.GET_TUTOR(id));
  return res.data.data;
};

export const createTutor = async (data: ICreateTutorPayload) => {
  const res = await apiClient.post<ITutorResponse>(ENDPOINTS.ADD_TUTOR, data);
  return res.data;
};

export const updateTutor = async (id: string, data: IUpdateTutorPayload) => {
  const res = await apiClient.put<ITutorResponse>(`${ENDPOINTS.UPDATE_TUTOR}/${id}`, data);
  return res.data;
};

export const deleteTutor = async (id: string) => {
  const res = await apiClient.delete<IApiResponse<null>>(`${ENDPOINTS.DELETE_TUTOR}/${id}`);
  return res.data;
};

export const approveTutor = async (id: string, status: "approved" | "rejected" = "approved") => {
  const res = await apiClient.put<ITutorResponse>(ENDPOINTS.APPROVE_TUTOR(id), { status });
  return res.data;
};

export const updateTutorPermissions = async (id: string, permissions: ITutorPermissions) => {
  const res = await apiClient.put<IApiResponse<ITutorPermissions>>(
    ENDPOINTS.UPDATE_TUTOR_PERMISSIONS(id),
    permissions
  );
  return res.data;
};

export const getTutorPerformance = async (id: string) => {
  const res = await apiClient.get<IApiResponse<any>>(
    ENDPOINTS.GET_TUTOR_PERFORMANCE(id)
  );
  return res.data.data;
};

export const awardGrowthPoints = async (data: IAwardGrowthPointsPayload) => {
  const res = await apiClient.post<IApiResponse<any>>(ENDPOINTS.ADD_GROWTH_POINT, data);
  return res.data;
};

export const getLeaderboard = async () => {
  const res = await apiClient.get<ILeaderboardResponse>(ENDPOINTS.GET_LEADERBOARD);
  return res.data;
};

