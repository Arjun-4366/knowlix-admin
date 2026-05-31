import { useQuery } from "@tanstack/react-query";
import { getTutorPerformanceReport } from "@/services/admin/reports/reports";

const REPORTS_KEY = ["reports"] as const;

export const useGetTutorPerformanceReport = (tutorId?: string) => {
  return useQuery({
    queryKey: [...REPORTS_KEY, "tutor_performance", tutorId],
    queryFn: () => getTutorPerformanceReport(tutorId),
  });
};
