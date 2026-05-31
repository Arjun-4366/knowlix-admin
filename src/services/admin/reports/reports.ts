import { apiClient } from "@/constants/apiClient";
import { ENDPOINTS } from "@/constants/endpoints";
import { ITutorPerformanceReportResponse } from "@/types/admin/reports";

export const getTutorPerformanceReport = async (tutorId?: string) => {
  const params: { type: string; tutorId?: string } = {
    type: "tutor_performance",
  };
  if (tutorId) {
    params.tutorId = tutorId;
  }
  const res = await apiClient.get<ITutorPerformanceReportResponse>(ENDPOINTS.GET_REPORTS, { params });
  return res.data;
};
