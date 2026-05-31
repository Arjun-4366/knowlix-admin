export interface ITutorDashboardExams {
  conducted: number;
  pending: number;
}

export interface ITutorDashboardGrowthBreakdown {
  G: number;
  H: number;
  O: number;
  R: number;
  T: number;
  W: number;
}

export interface ITutorDashboardKpiPerformance {
  attendanceRate: number;
  growthBreakdown: ITutorDashboardGrowthBreakdown;
  growthPoints: number;
}

export interface ITutorSession {
  id: string;
  studentId: string;
  tutorId: string;
  subject: string;
  scheduledAt: string;
  durationMinutes: number;
  status: "conducted" | "not_conducted" | "postponed";
  postponeReason?: string;
  tutorRemarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITutorDashboardSchedule {
  today: ITutorSession[] | null;
  tomorrow: ITutorSession[] | null;
}

export interface ITutorDashboardSessions {
  conducted: number;
  total: number;
}

export interface ITutorDashboardSlots {
  available: number;
  filled: number;
  total: number;
}

export interface ITutorDashboardTotalEarnings {
  amount: number;
  currency: string;
}

export interface ITutorDashboardPayload {
  exams: ITutorDashboardExams;
  kpiPerformance: ITutorDashboardKpiPerformance;
  schedule: ITutorDashboardSchedule;
  sessions: ITutorDashboardSessions;
  slots: ITutorDashboardSlots;
  totalAssignments: number;
  totalEarnings: ITutorDashboardTotalEarnings;
  totalStudents: number;
}
