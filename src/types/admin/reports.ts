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

export interface IStudentPerformanceReportItem {
  studentId: string;
  studentName: string;
  parentName: string;
  class: string;
  package: string;
  admissionStatus: string;
  totalSessions: number;
  conducted: number;
  notConducted: number;
  postponed: number;
}

export interface IStudentPerformanceReportResponse extends IApiResponse<IStudentPerformanceReportItem[]> {
  generatedAt: string;
  reportType: string;
  total: number;
}

export interface IAttendanceReportItem {
  [key: string]: any; // Payload was null, will update when structure is provided
}

export interface IAttendanceReportResponse extends IApiResponse<IAttendanceReportItem[]> {
  attendanceRate: number;
  conducted: number;
  notConducted: number;
  postponed: number;
  generatedAt: string;
  reportType: string;
  total: number;
}
