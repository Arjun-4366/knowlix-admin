import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getHRs, createHR, updateHRPassword, deleteHR } from "@/services/admin/hr/hr";

import { QueryParams } from "@/types/queryParams";
import {
  getHolidays,
  createHoliday,
  deleteHoliday,
  getHRTutorAttendance,
  getHRTutorAttendanceSummary,
  approveAttendance,
  approveBulkAttendance,
} from "@/services/hr/attendance";

import {
  createTutorEvaluation,
  getTutorEvaluations,
  updateTutorEvaluation,
} from "@/services/hr/performance";

import {
  createHRNotice,
  getHRNotices,
  updateHRNotice,
  deleteHRNotice,
} from "@/services/hr/notices";

import {
  getAttendanceReport,
  getSalaryReport,
  getPerformanceReport,
  getTurnoverAnalytics,
} from "@/services/hr/reports";

import {
  getTutorsHR,
  getTutorHR,
  createTutorByHR,
} from "@/services/hr/tutors";

import {
  ICreateHolidayPayload,
  IApproveAttendancePayload,
  ICreateHRPerformancePayload,
  ICreateHRNoticePayload,
  IHRNoticeQueryParams,
  IHRAttendanceQueryParams,
  ICreateHrPayload,
  IUpdateHrPasswordPayload,
} from "@/types/admin/hr";

// ── Query Keys ────────────────────────────────────────────────────────────────
export const HR_HOLIDAYS_KEY = ["hr-holidays"] as const;
export const HR_ATTENDANCE_KEY = ["hr-attendance"] as const;
export const HR_ATTENDANCE_SUMMARY_KEY = ["hr-attendance-summary"] as const;
export const HR_PERFORMANCE_KEY = ["hr-performance"] as const;
export const HR_NOTICES_KEY = ["hr-notices"] as const;
export const HR_TUTORS_KEY = ["hr-tutors"] as const;
export const HR_TUTOR_KEY = ["hr-tutor"] as const;
export const HR_REPORTS_KEY = ["hr-reports"] as const;

// ── Holiday Hooks ─────────────────────────────────────────────────────────────
export const useGetHolidays = () => {
  return useQuery({
    queryKey: HR_HOLIDAYS_KEY,
    queryFn: () => getHolidays(),
  });
};

export const useCreateHoliday = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateHolidayPayload) => createHoliday(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HR_HOLIDAYS_KEY });
      toast.success("Holiday created successfully");
    },
    onError: () => toast.error("Failed to create holiday"),
  });
};

export const useDeleteHoliday = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteHoliday(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HR_HOLIDAYS_KEY });
      toast.success("Holiday deleted successfully");
    },
    onError: () => toast.error("Failed to delete holiday"),
  });
};

// ── Attendance Hooks ──────────────────────────────────────────────────────────
export const useGetHRTutorAttendance = (params?: IHRAttendanceQueryParams) => {
  return useQuery({
    queryKey: [...HR_ATTENDANCE_KEY, params],
    queryFn: () => getHRTutorAttendance(params),
  });
};

export const useGetHRTutorAttendanceSummary = (params?: IHRAttendanceQueryParams) => {
  return useQuery({
    queryKey: [...HR_ATTENDANCE_SUMMARY_KEY, params],
    queryFn: () => getHRTutorAttendanceSummary(params),
  });
};

export const useApproveAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IApproveAttendancePayload }) =>
      approveAttendance(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HR_ATTENDANCE_KEY });
      queryClient.invalidateQueries({ queryKey: HR_ATTENDANCE_SUMMARY_KEY });
      toast.success("Attendance status updated successfully");
    },
    onError: () => toast.error("Failed to update attendance status"),
  });
};

export const useApproveBulkAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      tutorId: string;
      from?: string;
      to?: string;
      status: "approved" | "rejected";
      remarks?: string;
    }) => approveBulkAttendance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HR_ATTENDANCE_KEY });
      queryClient.invalidateQueries({ queryKey: HR_ATTENDANCE_SUMMARY_KEY });
      toast.success("Bulk attendance approved successfully");
    },
    onError: () => toast.error("Failed to approve bulk attendance"),
  });
};

// ── Performance Hooks ─────────────────────────────────────────────────────────
export const useGetTutorEvaluations = (params?: { tutorId?: string; period?: string }) => {
  return useQuery({
    queryKey: [...HR_PERFORMANCE_KEY, params],
    queryFn: () => getTutorEvaluations(params),
  });
};

export const useCreateTutorEvaluation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateHRPerformancePayload) => createTutorEvaluation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HR_PERFORMANCE_KEY });
      toast.success("Evaluation submitted successfully");
    },
    onError: () => toast.error("Failed to submit evaluation"),
  });
};

export const useUpdateTutorEvaluation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ICreateHRPerformancePayload> }) =>
      updateTutorEvaluation(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: HR_PERFORMANCE_KEY });
      toast.success("Evaluation updated successfully");
    },
    onError: () => toast.error("Failed to update evaluation"),
  });
};

// ── Notice Hooks ──────────────────────────────────────────────────────────────
export const useGetHRNotices = (params?: IHRNoticeQueryParams) => {
  return useQuery({
    queryKey: [...HR_NOTICES_KEY, params],
    queryFn: () => getHRNotices(params),
  });
};

export const useCreateHRNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateHRNoticePayload) => createHRNotice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HR_NOTICES_KEY });
      toast.success("Notice published successfully");
    },
    onError: () => toast.error("Failed to publish notice"),
  });
};

export const useUpdateHRNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ICreateHRNoticePayload> }) =>
      updateHRNotice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HR_NOTICES_KEY });
      toast.success("Notice updated successfully");
    },
    onError: () => toast.error("Failed to update notice"),
  });
};

export const useDeleteHRNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteHRNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HR_NOTICES_KEY });
      toast.success("Notice deleted successfully");
    },
    onError: () => toast.error("Failed to delete notice"),
  });
};

// ── Reports Hooks ─────────────────────────────────────────────────────────────
export const useGetAttendanceReport = (params?: { from?: string; to?: string; employeeId?: string }) => {
  return useQuery({
    queryKey: [...HR_REPORTS_KEY, "attendance", params],
    queryFn: () => getAttendanceReport(params),
  });
};

export const useGetSalaryReport = (params?: { department?: string }) => {
  return useQuery({
    queryKey: [...HR_REPORTS_KEY, "salary", params],
    queryFn: () => getSalaryReport(params),
  });
};

export const useGetPerformanceReport = (params?: { period?: string }) => {
  return useQuery({
    queryKey: [...HR_REPORTS_KEY, "performance", params],
    queryFn: () => getPerformanceReport(params),
  });
};

export const useGetTurnoverAnalytics = () => {
  return useQuery({
    queryKey: [...HR_REPORTS_KEY, "turnover"],
    queryFn: () => getTurnoverAnalytics(),
  });
};

// ── Tutors Hooks ──────────────────────────────────────────────────────────────
export const useGetTutorsHR = (params?: QueryParams & { status?: string }) => {
  return useQuery({
    queryKey: [...HR_TUTORS_KEY, params],
    queryFn: () => getTutorsHR(params),
  });
};

export const useGetTutorHR = (id: string) => {
  return useQuery({
    queryKey: [...HR_TUTOR_KEY, id],
    queryFn: () => getTutorHR(id),
    enabled: !!id,
  });
};

export const useCreateTutorByHR = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown> | FormData) => createTutorByHR(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HR_TUTORS_KEY });
      toast.success("Tutor submitted for approval successfully");
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || err.message || "Failed to submit tutor";
      toast.error(errMsg);
    },
  });
};

// -- Admin HR Management Hooks ----------------------------------------------------------


export const ADMIN_HRS_KEY = ["admin-hrs"] as const;

export const useGetHRs = (params?: QueryParams) => {
  return useQuery({
    queryKey: [...ADMIN_HRS_KEY, params],
    queryFn: () => getHRs(params),
  });
};

export const useCreateHR = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateHrPayload) => createHR(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_HRS_KEY });
      toast.success("HR created successfully");
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || err.message || "Failed to create HR";
      toast.error(errMsg);
    },
  });
};

export const useUpdateHRPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateHrPasswordPayload }) =>
      updateHRPassword(id, data),
    onSuccess: () => {
      toast.success("Password updated successfully");
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || err.message || "Failed to update password";
      toast.error(errMsg);
    },
  });
};

export const useDeleteHR = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteHR(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_HRS_KEY });
      toast.success("HR deleted successfully");
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || err.message || "Failed to delete HR";
      toast.error(errMsg);
    },
  });
};
