import { apiClient } from "@/constants/apiClient";
import { ENDPOINTS } from "@/constants/endpoints";
import { ITutorPerformanceReportResponse, IStudentPerformanceReportResponse, IAttendanceReportResponse, ISessionReportResponse } from "@/types/admin/reports";

export const getTutorPerformanceReport = async (tutorId?: string, startDate?: string, endDate?: string) => {
  const params: { type: string; tutorId?: string; startDate?: string; endDate?: string } = {
    type: "tutor_performance",
  };
  if (tutorId) {
    params.tutorId = tutorId;
  }
  if (startDate) {
    params.startDate = startDate;
  }
  if (endDate) {
    params.endDate = endDate;
  }
  const res = await apiClient.get<ITutorPerformanceReportResponse>(ENDPOINTS.GET_REPORTS, { params });
  return res.data;
};

export const getStudentPerformanceReport = async (startDate?: string, endDate?: string) => {
  const params: { type: string; startDate?: string; endDate?: string } = {
    type: "student_performance",
  };
  if (startDate) {
    params.startDate = startDate;
  }
  if (endDate) {
    params.endDate = endDate;
  }
  // The backend uses GET_REPORTS for all report types by passing type in query
  const res = await apiClient.get<IStudentPerformanceReportResponse>(ENDPOINTS.GET_REPORTS, { params });
  return res.data;
};

export const getAttendanceReport = async (startDate?: string, endDate?: string) => {
  const params: { type: string; startDate?: string; endDate?: string } = {
    type: "attendance",
  };
  if (startDate) {
    params.startDate = startDate;
  }
  if (endDate) {
    params.endDate = endDate;
  }
  const res = await apiClient.get<IAttendanceReportResponse>(ENDPOINTS.GET_REPORTS, { params });
  return res.data;
};

export const getSessionReport = async (startDate?: string, endDate?: string) => {
  const params: { type: string; startDate?: string; endDate?: string } = {
    type: "session",
  };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  const res = await apiClient.get<ISessionReportResponse>(ENDPOINTS.GET_REPORTS, { params });
  return res.data;
};
