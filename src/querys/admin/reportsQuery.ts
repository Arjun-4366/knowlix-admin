import { useQuery } from "@tanstack/react-query";
import {
  getTutorPerformanceReport,
  getStudentPerformanceReport,
  getAttendanceReport,
  getSessionReport,
} from "@/services/admin/reports/reports";

const REPORTS_KEY = ["reports"] as const;

export const useGetTutorPerformanceReport = (
  tutorId?: string,
  startDate?: string,
  endDate?: string,
  enabled = true
) => {
  return useQuery({
    queryKey: [...REPORTS_KEY, "tutor_performance", tutorId, startDate, endDate],
    queryFn: () => getTutorPerformanceReport(tutorId, startDate, endDate),
    enabled,
  });
};

export const useGetStudentPerformanceReport = (
  startDate?: string,
  endDate?: string,
  enabled = true
) => {
  return useQuery({
    queryKey: [...REPORTS_KEY, "student_performance", startDate, endDate],
    queryFn: () => getStudentPerformanceReport(startDate, endDate),
    enabled,
  });
};

export const useGetAttendanceReport = (
  startDate?: string,
  endDate?: string,
  enabled = true
) => {
  return useQuery({
    queryKey: [...REPORTS_KEY, "attendance", startDate, endDate],
    queryFn: () => getAttendanceReport(startDate, endDate),
    enabled,
  });
};

export const useGetSessionReport = (
  startDate?: string,
  endDate?: string,
  enabled = true
) => {
  return useQuery({
    queryKey: [...REPORTS_KEY, "session", startDate, endDate],
    queryFn: () => getSessionReport(startDate, endDate),
    enabled,
  });
};
