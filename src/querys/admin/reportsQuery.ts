import { useQuery } from "@tanstack/react-query";
import { getTutorPerformanceReport } from "@/services/admin/reports/reports";

const REPORTS_KEY = ["reports"] as const;

export const useGetTutorPerformanceReport = (tutorId?: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: [...REPORTS_KEY, "tutor_performance", tutorId, startDate, endDate],
    queryFn: () => getTutorPerformanceReport(tutorId, startDate, endDate),
  });
};
