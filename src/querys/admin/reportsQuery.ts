import { useQuery } from "@tanstack/react-query";
import { getTutorPerformanceReport, getStudentPerformanceReport, getAttendanceReport } from "@/services/admin/reports/reports";

const REPORTS_KEY = ["reports"] as const;

export const useGetTutorPerformanceReport = (tutorId?: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: [...REPORTS_KEY, "tutor_performance", tutorId, startDate, endDate],
    queryFn: () => getTutorPerformanceReport(tutorId, startDate, endDate),
  });
};

export const useGetStudentPerformanceReport = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: [...REPORTS_KEY, "student_performance", startDate, endDate],
    queryFn: () => getStudentPerformanceReport(startDate, endDate),
  });
};

export const useGetAttendanceReport = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: [...REPORTS_KEY, "attendance", startDate, endDate],
    queryFn: () => getAttendanceReport(startDate, endDate),
  });
};
