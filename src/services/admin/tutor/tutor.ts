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
  IAwardGrowthPointsPayload,
  ILeaderboardResponse,
  ITutorDetailsResponse,
  IAssignStudentsPayload,
  IGrowthHistoryResponse,
} from "@/types/admin/tutor";

export const getTutors = async (params?: QueryParams) => {
  const res = await apiClient.get<ITutorsResponse>(ENDPOINTS.GET_TUTORS, { params });
  return res.data;
};

export const getTutor = async (id: string) => {
  const res = await apiClient.get<ITutorDetailsResponse>(ENDPOINTS.GET_TUTOR(id));
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



export const getTutorPerformance = async (id: string) => {
  const res = await apiClient.get<IApiResponse<any>>(
    ENDPOINTS.GET_TUTOR_PERFORMANCE(id)
  );
  return res.data.data;
};

export const awardGrowthPoints = async (data: IAwardGrowthPointsPayload) => {
  const res = await apiClient.post<IApiResponse<any>>(ENDPOINTS.ADD_GROWTH_POINT, [data]);
  return res.data;
};

export const getLeaderboard = async () => {
  const res = await apiClient.get<ILeaderboardResponse>(ENDPOINTS.GET_LEADERBOARD);
  return res.data;
};

export const assignStudentsToTutor = async (id: string, payload: IAssignStudentsPayload) => {
  const res = await apiClient.put<IApiResponse<any>>(ENDPOINTS.ASSIGN_STUDENTS_TO_TUTOR(id), payload);
  return res.data;
};

export const getGrowthHistory = async (params: { tutorId: string; month?: string; year?: number }) => {
  const res = await apiClient.get<IGrowthHistoryResponse>(ENDPOINTS.GET_GROWTH_HISTORY, { params });
  return res.data;
};

export const getAdminTutorSessions = async (id: string, params?: { page?: number; limit?: number }) => {
  const res = await apiClient.get<any>(ENDPOINTS.GET_ADMIN_TUTOR_SESSIONS(id), { params });
  return res.data;
};

export const getAdminTutorAssignments = async (id: string, params?: { page?: number; limit?: number }) => {
  const res = await apiClient.get<any>(ENDPOINTS.GET_ADMIN_TUTOR_ASSIGNMENTS(id), { params });
  return res.data;
};

export const getAdminTutorExams = async (id: string, params?: { page?: number; limit?: number }) => {
  const res = await apiClient.get<any>(ENDPOINTS.GET_ADMIN_TUTOR_EXAMS(id), { params });
  return res.data;
};

export const getAdminTutorAttendance = async (id: string, params?: { page?: number; limit?: number }) => {
  const res = await apiClient.get<any>(ENDPOINTS.GET_ADMIN_TUTOR_ATTENDANCE(id), { params });
  return res.data;
};
