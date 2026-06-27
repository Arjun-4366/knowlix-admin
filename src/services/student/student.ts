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
  IStudentProfile,
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

export const submitStudentAssignment = async (id: string, files: File[], remarks?: string) => {
  const fd = new FormData();
  files.forEach((file) => fd.append("files", file));
  if (remarks?.trim()) fd.append("remarks", remarks.trim());
  const res = await apiClient.post<IApiResponse<IStudentSubmission>>(
    ENDPOINTS.SUBMIT_STUDENT_ASSIGNMENT(id),
    fd
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

export const getStudentProfile = async () => {
  const res = await apiClient.get<IApiResponse<IStudentProfile>>(ENDPOINTS.GET_STUDENT_PROFILE);
  return res.data.data;
};

export interface IStudentNote {
  id: string;
  title: string;
  description: string;
  subject: string;
  chapter: string;
  standard: string;
  syllabus: string;
  attachmentType: "pdf" | "document" | "image";
  fileUrl: string;
  tags: string[];
  content: string;
  status: string;
  createdAt: string;
}

export const getStudentNoteSubjects = async () => {
  const res = await apiClient.get<{ data: string[]; status: string }>(
    ENDPOINTS.GET_STUDENT_NOTE_SUBJECTS
  );
  return res.data;
};

export const getStudentNoteChapters = async (subject: string) => {
  const res = await apiClient.get<{ data: string[]; status: string }>(
    ENDPOINTS.GET_STUDENT_NOTE_CHAPTERS,
    { params: { subject } }
  );
  return res.data;
};

export const getStudentNotes = async (params: { subject: string; chapter: string }) => {
  const res = await apiClient.get<{
    data: IStudentNote[];
    pagination: { limit: number; page: number; total: number; totalPages: number };
    status: string;
  }>(ENDPOINTS.GET_STUDENT_NOTES, { params });
  return res.data;
};