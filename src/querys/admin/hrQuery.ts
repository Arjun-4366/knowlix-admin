import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getHRs, createHR, updateHR, updateHRPassword, deleteHR } from "@/services/admin/hr/hr";

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
  createHRPerformance,
  getHRPerformanceHistory,
  getHRGrowthLeaderboard,
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
  getHRSalaryList,
  createHRSalary,
  updateHRSalary,
  deleteHRSalary,
} from "@/services/hr/salary";

import {
  getTutorsHR,
  getTutorHR,
  createTutorByHR,
  updateTutorHR,
  addRemarkHR,
  ITutorHRQueryParams,
  IUpdateTutorHRPayload,
  IAddRemarkPayload,
} from "@/services/hr/tutors";

import { getHRProfile } from "@/services/hr/profile";

import {
  ICreateHolidayPayload,
  IApproveAttendancePayload,
  IHRPerformancePayload,
  ICreateHRNoticePayload,
  IHRNoticeQueryParams,
  IHRAttendanceQueryParams,
  ICreateHrPayload,
  IUpdateHrPayload,
  IUpdateHrPasswordPayload,
  ICreateHRSalaryPayload,
  IUpdateHRSalaryPayload,
} from "@/types/admin/hr";

import { ICreateTutorPayload } from "@/types/admin/tutor";

// ── Query Keys ────────────────────────────────────────────────────────────────
export const HR_HOLIDAYS_KEY = ["hr-holidays"] as const;
export const HR_ATTENDANCE_KEY = ["hr-attendance"] as const;
export const HR_ATTENDANCE_SUMMARY_KEY = ["hr-attendance-summary"] as const;
export const HR_PERFORMANCE_KEY = ["hr-performance"] as const;
export const HR_NOTICES_KEY = ["hr-notices"] as const;
export const HR_TUTORS_KEY = ["hr-tutors"] as const;
export const HR_TUTOR_KEY = ["hr-tutor"] as const;
export const HR_REPORTS_KEY = ["hr-reports"] as const;
export const HR_SALARY_KEY = ["hr-salary"] as const;

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

// ── Performance / Growth Hooks ────────────────────────────────────────────────
export const useGetHRGrowthLeaderboard = () => {
  return useQuery({
    queryKey: [...HR_PERFORMANCE_KEY, "leaderboard"],
    queryFn: () => getHRGrowthLeaderboard(),
  });
};

export const useGetHRPerformanceHistory = (params?: { tutorId?: string; month?: string; year?: number }) => {
  return useQuery({
    queryKey: [...HR_PERFORMANCE_KEY, "history", params],
    queryFn: () => getHRPerformanceHistory(params),
  });
};

export const useCreateHRPerformance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IHRPerformancePayload) => createHRPerformance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HR_PERFORMANCE_KEY });
      toast.success("Performance record created successfully");
    },
    onError: () => toast.error("Failed to create performance record"),
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

export const useGetSalaryReport = (params?: import("@/types/admin/hr").ISalaryReportQueryParams) => {
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

// ── Salary Management Hooks ───────────────────────────────────────────────────
export const useGetHRSalaryList = () => {
  return useQuery({
    queryKey: HR_SALARY_KEY,
    queryFn: () => getHRSalaryList(),
  });
};

export const useCreateHRSalary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateHRSalaryPayload) => createHRSalary(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HR_SALARY_KEY });
      queryClient.invalidateQueries({ queryKey: HR_REPORTS_KEY });
      toast.success("Salary record created successfully");
    },
    onError: () => toast.error("Failed to create salary record"),
  });
};

export const useUpdateHRSalary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateHRSalaryPayload }) =>
      updateHRSalary(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HR_SALARY_KEY });
      queryClient.invalidateQueries({ queryKey: HR_REPORTS_KEY });
      toast.success("Salary record updated successfully");
    },
    onError: () => toast.error("Failed to update salary record"),
  });
};

export const useDeleteHRSalary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteHRSalary(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HR_SALARY_KEY });
      queryClient.invalidateQueries({ queryKey: HR_REPORTS_KEY });
      toast.success("Salary record deleted successfully");
    },
    onError: () => toast.error("Failed to delete salary record"),
  });
};

// ── Tutors Hooks ──────────────────────────────────────────────────────────────
export const useGetTutorsHR = (params?: ITutorHRQueryParams) => {
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

export const useUpdateTutorByHR = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateTutorHRPayload }) =>
      updateTutorHR(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HR_TUTORS_KEY });
      toast.success("Tutor updated successfully");
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || err.message || "Failed to update tutor";
      toast.error(errMsg);
    },
  });
};

export const useAddRemarkHR = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IAddRemarkPayload }) =>
      addRemarkHR(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [...HR_TUTOR_KEY, id] });
      toast.success("Remark added successfully");
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || err.message || "Failed to add remark";
      toast.error(errMsg);
    },
  });
};

export const useCreateTutorByHR = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateTutorPayload) => createTutorByHR(data),
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

export const useUpdateHR = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateHrPayload }) => updateHR(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_HRS_KEY });
      toast.success("HR member updated successfully");
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || err.message || "Failed to update HR member";
      toast.error(errMsg);
    },
  });
};

export const useUpdateHRPassword = () => {
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

const HR_PROFILE_KEY = ["hr-profile"] as const;

export const useGetHRProfile = () => {
  return useQuery({
    queryKey: HR_PROFILE_KEY,
    queryFn: getHRProfile,
  });
};
