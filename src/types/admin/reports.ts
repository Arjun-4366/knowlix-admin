import { IApiResponse } from "@/types/admin/api";

export interface ITutorPerformanceReportItem {
  tutorId: string;
  name: string;
  role: string;
  growthPoints: number;
  performanceScore: number;
  growthBreakdown: {
    G: number;
    H: number;
    O: number;
    R: number;
    T: number;
    W: number;
  };
  totalSessions: number;
  conductedSessions: number;
  attendanceRate: number;
}

export interface ITutorPerformanceReportResponse extends IApiResponse<ITutorPerformanceReportItem[]> {
  generatedAt: string;
  reportType: string;
  total: number;
}
