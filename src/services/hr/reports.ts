import { apiClient } from "@/constants/apiClient";
import { ENDPOINTS } from "@/constants/endpoints";
import {
  IAttendanceReportResponse,
  ISalaryReportResponse,
  ISalaryReportQueryParams,
  IPerformanceReportResponse,
  ITurnoverReportResponse,
} from "@/types/admin/hr";

export const getAttendanceReport = async (params?: { from?: string; to?: string; employeeId?: string }) => {
  const res = await apiClient.get<IAttendanceReportResponse>(
    ENDPOINTS.GET_HR_ATTENDANCE_REPORT,
    { params }
  );
  return res.data;
};

export const getSalaryReport = async (params?: ISalaryReportQueryParams) => {
  const res = await apiClient.get<ISalaryReportResponse>(ENDPOINTS.GET_HR_SALARY, { params });
  return res.data;
};

export const getPerformanceReport = async (params?: { period?: string }) => {
  const res = await apiClient.get<IPerformanceReportResponse>(
    ENDPOINTS.GET_HR_PERFORMANCE_REPORT,
    { params }
  );
  return res.data;
};

export const getTurnoverAnalytics = async () => {
  const res = await apiClient.get<ITurnoverReportResponse>(ENDPOINTS.GET_HR_TURNOVER);
  return res.data;
};
