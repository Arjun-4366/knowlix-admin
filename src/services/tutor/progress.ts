import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/constants/apiClient";
import { IApiResponse } from "@/types/admin/api";
import {
  ICreateProgressPayload,
  IProgressReport,
  IProgressReportsResponse,
  IUpdateProgressPayload,
} from "@/types/tutor/progress";

export const createProgressReport = async (payload: ICreateProgressPayload) => {
  const res = await apiClient.post<IApiResponse<IProgressReport>>(
    ENDPOINTS.TUTOR_PROGRESS_CREATE,
    payload
  );
  return res.data;
};

export const fetchProgressReports = async () => {
  const res = await apiClient.get<IProgressReportsResponse>(ENDPOINTS.TUTOR_PROGRESS_FETCH);
  return res.data;
};

export const updateProgressReport = async (id: string, payload: IUpdateProgressPayload) => {
  const res = await apiClient.put<IApiResponse<IProgressReport>>(
    ENDPOINTS.TUTOR_PROGRESS_UPDATE(id),
    payload
  );
  return res.data;
};

export const deleteProgressReport = async (id: string) => {
  const res = await apiClient.delete<IApiResponse<null>>(ENDPOINTS.TUTOR_PROGRESS_DELETE(id));
  return res.data;
};
