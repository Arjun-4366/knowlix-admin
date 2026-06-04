import { apiClient } from "@/constants/apiClient";
import { ENDPOINTS } from "@/constants/endpoints";
import {
  IApproveAttendancePayload,
  IAttendanceSummaryItem,
  ICreateHolidayPayload,
  IHoliday,
  IHolidayResponse,
  IHolidaysResponse,
  IHRAttendanceListResponse,
  IHRAttendanceQueryParams,
} from "@/types/admin/hr";
import { IApiResponse } from "@/types/admin/api";

// ── Holidays ──────────────────────────────────────────────────────────────────

export const getHolidays = async () => {
  const res = await apiClient.get<IHolidaysResponse>(ENDPOINTS.GET_HOLIDAYS);
  return res.data;
};

export const createHoliday = async (data: ICreateHolidayPayload) => {
  const res = await apiClient.post<IHolidayResponse>(ENDPOINTS.CREATE_HOLIDAY, data);
  return res.data;
};

export const deleteHoliday = async (id: string) => {
  const res = await apiClient.delete<IApiResponse<null>>(ENDPOINTS.DELETE_HOLIDAY(id));
  return res.data;
};

// ── Tutor Attendance (HR view) ────────────────────────────────────────────────

export const getHRTutorAttendance = async (params?: IHRAttendanceQueryParams) => {
  const res = await apiClient.get<IHRAttendanceListResponse>(
    ENDPOINTS.GET_HR_TUTOR_ATTENDANCE,
    { params }
  );
  return res.data;
};

export const getHRTutorAttendanceSummary = async (params?: IHRAttendanceQueryParams) => {
  const res = await apiClient.get<IApiResponse<IAttendanceSummaryItem[]>>(
    ENDPOINTS.GET_HR_TUTOR_ATTENDANCE_SUMMARY,
    { params }
  );
  return res.data;
};

export const approveAttendance = async (id: string, data: IApproveAttendancePayload) => {
  const res = await apiClient.put<IApiResponse<null>>(ENDPOINTS.APPROVE_ATTENDANCE(id), data);
  return res.data;
};

export const approveBulkAttendance = async (data: {
  tutorId: string;
  from?: string;
  to?: string;
  status: "approved" | "rejected";
  remarks?: string;
}) => {
  const res = await apiClient.put<IApiResponse<{ updated: number }>>(
    ENDPOINTS.APPROVE_ATTENDANCE_BULK,
    data
  );
  return res.data;
};
