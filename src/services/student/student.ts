import { apiClient } from "@/constants/apiClient";
import { ENDPOINTS } from "@/constants/endpoints";
import { IApiResponse } from "@/types/admin/api";
import { QueryParams } from "@/types/queryParams";
import {
  IStudentDashboard,
  IStudentNoticesResponse,
  IStudentScheduleResponse,
  IAssignment,
  IAssignmentStatusResponse,
  IStudentSubmission,
  IResultWithExam,
  ISubjectGrade,
  IMonthlyTrend,
  IStudentFeesResponse,
  IStudentFeeStatusResponse,
} from "@/types/student/student";

export const getStudentDashboard = async (params?: QueryParams) => {
  const res = await apiClient.get<IApiResponse<IStudentDashboard>>(ENDPOINTS.GET_STUDENT_DASHBOARD, { params });
  return res.data.data;
};

export const getStudentNotices = async (params?: QueryParams) => {
  const res = await apiClient.get<IStudentNoticesResponse & { status: string }>(ENDPOINTS.GET_STUDENT_NOTICES, { params });
  return res.data;
};

export const queryStudentChatbot = async (message: string) => {
  const res = await apiClient.post<IApiResponse<{ query: string; response: string }>>(ENDPOINTS.STUDENT_CHATBOT, { message });
  return res.data.data;
};

export const getStudentSchedule = async (params?: QueryParams) => {
  const res = await apiClient.get<IStudentScheduleResponse & { status: string }>(ENDPOINTS.GET_STUDENT_SCHEDULE, { params });
  return res.data;
};

export const getStudentAssignments = async (params?: QueryParams) => {
  const res = await apiClient.get<IApiResponse<IAssignment[]>>(ENDPOINTS.GET_STUDENT_ASSIGNMENTS, { params });
  return res.data.data;
};

export const submitStudentAssignment = async (id: string, fileUrl: string, remarks?: string) => {
  const res = await apiClient.post<IApiResponse<IStudentSubmission>>(
    ENDPOINTS.SUBMIT_STUDENT_ASSIGNMENT(id),
    { fileUrl, remarks }
  );
  return res.data.data;
};

export const getStudentAssignmentStatus = async (id: string) => {
  const res = await apiClient.get<IApiResponse<IAssignmentStatusResponse>>(ENDPOINTS.GET_STUDENT_ASSIGNMENT_STATUS(id));
  return res.data.data;
};

export const getStudentResults = async (params?: QueryParams) => {
  const res = await apiClient.get<IApiResponse<IResultWithExam[]>>(ENDPOINTS.GET_STUDENT_RESULTS, { params });
  return res.data.data;
};

export const getStudentResultsGrades = async (params?: QueryParams) => {
  const res = await apiClient.get<IApiResponse<ISubjectGrade[]>>(ENDPOINTS.GET_STUDENT_RESULTS_GRADES, { params });
  return res.data.data;
};

export const getStudentResultsAnalytics = async (params?: QueryParams) => {
  const res = await apiClient.get<IApiResponse<IMonthlyTrend[]>>(ENDPOINTS.GET_STUDENT_RESULTS_ANALYTICS, { params });
  return res.data.data;
};

export const getStudentFees = async (params?: QueryParams) => {
  const res = await apiClient.get<IApiResponse<IStudentFeesResponse>>(ENDPOINTS.GET_STUDENT_FEES, { params });
  return res.data.data;
};

export const getStudentFeesStatus = async (params?: QueryParams) => {
  const res = await apiClient.get<IApiResponse<IStudentFeeStatusResponse>>(ENDPOINTS.GET_STUDENT_FEES_STATUS, { params });
  return res.data.data;
};
