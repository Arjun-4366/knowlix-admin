import { IApiResponse } from "./api";

// ── Holiday ────────────────────────────────────────────────────────────────────

export interface IHoliday {
  id: string;
  date: string; // ISO string from backend
  name: string;
  description?: string;
  isOptional: boolean;
  createdAt: string;
}

export interface ICreateHolidayPayload {
  date: string; // "YYYY-MM-DD"
  name: string;
  description?: string;
  isOptional?: boolean;
}

export type IHolidayResponse = IApiResponse<IHoliday>;
export type IHolidaysResponse = IApiResponse<IHoliday[]> & { total: number };

// ── Attendance (tutor-based HR attendance) ────────────────────────────────────

export type HRAttendanceStatus = "present" | "absent" | "half_day" | "late" | "on_leave";

export interface IHRAttendanceRecord {
  id: string;
  tutorId: string;
  date: string;
  status: HRAttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  workHours?: number;
  remarks?: string;
  markedBy: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface IApproveAttendancePayload {
  status: "approved" | "rejected";
  remarks?: string;
}

export type IHRAttendanceResponse = IApiResponse<IHRAttendanceRecord>;
export type IHRAttendanceListResponse = IApiResponse<IHRAttendanceRecord[]> & { total: number };

export interface IAttendanceSummaryItem {
  _id: string; // tutorId
  daysPresent: number;
  totalMinutes: number;
  totalHours: number;
  totalSessions: number;
}

// ── HR Notices / Announcements ────────────────────────────────────────────────

export type HRNoticeCategory = "announcement" | "notice" | "general";
export type HRNoticePriority = "low" | "medium" | "high";

export interface IHRNotice {
  id: string;
  category: HRNoticeCategory;
  title: string;
  content: string;
  authorId: string;
  department?: string;
  audience?: string;
  priority: HRNoticePriority;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateHRNoticePayload {
  category?: HRNoticeCategory;
  title: string;
  content: string;
  department?: string;
  audience?: string;
  priority?: HRNoticePriority;
  isPublished?: boolean;
}

export type IHRNoticeResponse = IApiResponse<IHRNotice>;
export type IHRNoticesResponse = IApiResponse<IHRNotice[]> & { total: number };

// ── Performance Evaluations (Tutor HR) ───────────────────────────────────────

export interface IHRPerformanceEvaluation {
  id: string;
  tutorId: string;
  evaluatorId: string;
  period: string; // "YYYY-MM"
  scores: Record<string, number>;
  averageScore: number;
  feedback?: string;
  goals?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateHRPerformancePayload {
  tutorId: string;
  period: string;
  scores: Record<string, number>;
  feedback?: string;
  goals?: string;
}

export type IHRPerformanceResponse = IApiResponse<IHRPerformanceEvaluation>;
export type IHRPerformanceListResponse = IApiResponse<IHRPerformanceEvaluation[]> & { total: number };

// ── Reports ───────────────────────────────────────────────────────────────────

export interface IAttendanceSummaryEntry {
  employeeId: string;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  totalDays: number;
  totalWorkHours: number;
}

export interface IAttendanceReportResponse {
  status: string;
  data: {
    summary: IAttendanceSummaryEntry[];
    records: unknown[];
  };
}

export interface ISalaryEntry {
  employeeId: string;
  name: string;
  department: string;
  designation: string;
  salary: number;
  currency: string;
}

export interface ISalaryReportData {
  totalMonthlyPayroll: number;
  employeeCount: number;
  employees: ISalaryEntry[];
}

export type ISalaryReportResponse = IApiResponse<ISalaryReportData>;

export interface IPerformanceReportEntry {
  employeeId: string;
  evaluations: number;
  averageScore: number;
  coreValueAverages: Record<string, number>;
}

export type IPerformanceReportResponse = IApiResponse<IPerformanceReportEntry[]>;

export interface ITurnoverMonthEntry {
  month: string;
  joinings: number;
  exits: number;
}

export interface ITurnoverData {
  active: number;
  resigned: number;
  terminated: number;
  total: number;
  turnoverRate: number;
  monthly: ITurnoverMonthEntry[];
}

export type ITurnoverReportResponse = IApiResponse<ITurnoverData>;

// ── Query helpers ─────────────────────────────────────────────────────────────

export interface IHRAttendanceQueryParams {
  tutorId?: string;
  from?: string;
  to?: string;
}

export interface IHRNoticeQueryParams {
  category?: HRNoticeCategory;
  department?: string;
  audience?: string;
  priority?: HRNoticePriority;
}
