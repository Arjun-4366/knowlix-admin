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
  tutorId: string;
  type: string;
  studentIds: string[];
  title: string;
  subject: string;
  meetLink: string;
  scheduledAt: string;
  durationMinutes: number;
  status: "scheduled" | "conducted" | "not_conducted" | "completed";
  notes: string;
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
  currency: string;
  pending: number;
  received: number;
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

export interface ITutorSalary {
  id: string;
  tutorId: string;
  month: string;
  year: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: "paid" | "partial" | "pending";
  remarks: string;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
}
