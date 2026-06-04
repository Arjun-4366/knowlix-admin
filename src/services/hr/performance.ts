import { apiClient } from "@/constants/apiClient";
import { ENDPOINTS } from "@/constants/endpoints";
import {
  ICreateHRPerformancePayload,
  IHRPerformanceListResponse,
  IHRPerformanceResponse,
} from "@/types/admin/hr";
import { IApiResponse } from "@/types/admin/api";

// ── Tutor Performance Evaluations (HR view) ───────────────────────────────────

export const createTutorEvaluation = async (data: ICreateHRPerformancePayload) => {
  const res = await apiClient.post<IHRPerformanceResponse>(
    ENDPOINTS.CREATE_PERFORMANCE,
    data
  );
  return res.data;
};

export const getTutorEvaluations = async (params?: { tutorId?: string; period?: string }) => {
  const res = await apiClient.get<IHRPerformanceListResponse>(
    ENDPOINTS.GET_PERFORMANCE,
    { params }
  );
  return res.data;
};

export const updateTutorEvaluation = async (id: string, data: Partial<ICreateHRPerformancePayload>) => {
  const res = await apiClient.put<IApiResponse<null>>(
    ENDPOINTS.UPDATE_PERFORMANCE(id),
    data
  );
  return res.data;
};
