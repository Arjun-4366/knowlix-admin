export type ReportType = "tutor" | "student" | "attendance" | "session" | "revenue";

export interface DateRange {
  startDate: string;
  endDate: string;
  preset: string;
}

export interface ReportFiltersState {
  type: ReportType;
  dateRange: DateRange;
  tutorTier: string;
  studentGrade: string;
  attendanceStatus: string;
  sessionStatus: string;
  revenuePackage: string;
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

export interface StudentPerformanceReport {
  id: string;
  name: string;
  grade: string;
  courseType: string;
  courseName: string;
  avgAcademicScore: number; // percentage
  attendanceRate: number; // percentage
  assignmentsSubmitted: number;
  assignmentsTotal: number;
  tutorName: string;
  performanceTier: "Top Performer" | "Average" | "Needs Support";
}

export interface AttendanceReport {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  courseName: string;
  sessionsScheduled: number;
  sessionsPresent: number;
  sessionsAbsent: number;
  sessionsExcused: number;
  attendanceRate: number; // percentage
}

export interface SessionReport {
  id: string;
  date: string;
  timeSlot: string;
  studentName: string;
  tutorName: string;
  subject: string;
  duration: number; // in minutes
  status: "Completed" | "Scheduled" | "Cancelled";
  remarks?: string;
}

export interface RevenueReport {
  invoiceId: string;
  date: string;
  studentName: string;
  courseType: "Online School" | "Online Tuition" | "Hybrid Learning";
  courseName: string;
  packageName: string;
  amount: number; // in INR
  paymentStatus: "Paid" | "Pending" | "Refunded";
  paymentMethod: "UPI" | "Net Banking" | "Credit Card" | "Debit Card";
}
