export type ReportType = "tutor";

export interface DateRange {
  startDate: string;
  endDate: string;
  preset: string;
}

export interface ReportFiltersState {
  type: ReportType;
  dateRange: DateRange;
  tutorTier: string;
  tutorId?: string;
}

export interface TutorPerformanceReport {
  id: string;
  name: string;
  subject: string;
  classesConducted: number;
  rating: number;
  retentionRate: number; // percentage
  satisfactionRate: number; // percentage
  performanceTier: "Outstanding" | "Excellent" | "Very Good" | "Needs Attention";
  activeStudents: number;
}
