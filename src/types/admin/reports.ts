import { IApiResponse } from "@/types/admin/api";

export interface ITutorPerformanceReportItem {
  tutorId: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  subjects: string[];
  syllabus: string[];
  assignedStudentCount: number;
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
  notConductedSessions: number;
  scheduledSessions: number;
  attendanceRate: number;
  totalWorkHours: number;
  positiveRemarksCount: number;
  negativeRemarksCount: number;
  joinedAt: string;
}

export interface ITutorPerformanceReportResponse extends IApiResponse<ITutorPerformanceReportItem[]> {
  generatedAt: string;
  reportType: string;
  total: number;
}

export interface IStudentPerformanceReportItem {
  studentId: string;
  admissionNumber: string;
  studentName: string;
  parentName: string;
  email: string;
  phone: string;
  class: string;
  place: string;
  syllabus: string;
  package: string;
  programName: string;
  courseName: string;
  mentorName: string;
  admissionStatus: string;
  totalFee: number;
  paidAmount: number;
  balanceFee: number;
  totalSessions: number;
  conducted: number;
  notConducted: number;
  scheduled: number;
  attendanceTotal: number;
  attendancePresent: number;
  attendanceAbsent: number;
  attendanceLate: number;
  attendanceRate: number;
  enrolledAt: string;
}

export interface IStudentPerformanceReportResponse extends IApiResponse<IStudentPerformanceReportItem[]> {
  generatedAt: string;
  reportType: string;
  total: number;
}

export interface IAttendanceReportItem {
  tutorId: string;
  tutorName: string;
  tutorEmail: string;
  totalDays: number;
  totalMinutes: number;
  totalWorkHours: number;
  totalSessions: number;
}

export interface IAttendanceReportResponse extends IApiResponse<IAttendanceReportItem[]> {
  generatedAt: string;
  reportType: string;
  status: string;
  totalSessions: number;
  totalTutors: number;
  totalWorkHours: number;
}

export interface ISessionStudent {
  studentId: string;
  studentName: string;
  class: string;
}

export interface ISessionReportItem {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorEmail: string;
  type: "individual" | "group";
  title: string;
  subject: string;
  meetLink: string;
  scheduledAt: string;
  durationMinutes: number;
  status: "completed" | "conducted" | "not_conducted" | "scheduled";
  notes: string;
  students: ISessionStudent[];
  createdAt: string;
  updatedAt: string;
}

export interface ISessionReportResponse extends IApiResponse<ISessionReportItem[]> {
  conducted: number;
  notConducted: number;
  scheduled: number;
  total: number;
  generatedAt: string;
  reportType: string;
  status: string;
}
