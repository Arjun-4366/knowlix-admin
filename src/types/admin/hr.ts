import { IApiResponse } from "./api";

// ── HR Management ─────────────────────────────────────────────────────────────

export interface IHr {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: "active" | "inactive" | string;
  createdAt: string;
}

export interface ICreateHrPayload {
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  password?: string;
}

export type IHrResponse = IApiResponse<IHr>;
export type IHrsResponse = IApiResponse<IHr[]> & { total: number };

export interface IUpdateHrPasswordPayload {
  password: string;
}

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

export type HRAttendanceStatus =
  | "pending_approval"
  | "approved"
  | "rejected"
  | "present"
  | "absent"
  | "half_day"
  | "late"
  | "on_leave";

export interface IHRAttendanceTutorRef {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects?: string[];
  experience?: string;
  availability?: string[];
  status?: string;
}

export interface IHRAttendanceRecord {
  id: string;
  tutorId: string;
  tutor: IHRAttendanceTutorRef | null;
  date: string;
  status: HRAttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  workHours?: number;
  remarks?: string;
  markedBy: string;
  createdAt: string;
}

export interface IHRAttendanceSummary {
  approved: number;
  pending_approval: number;
  rejected: number;
}

export interface IApproveAttendancePayload {
  status: "approved" | "rejected";
  remarks?: string;
}

export type IHRAttendanceResponse = IApiResponse<IHRAttendanceRecord>;
export type IHRAttendanceListResponse = IApiResponse<IHRAttendanceRecord[]> & {
  total: number;
  totalPages: number;
  summary: IHRAttendanceSummary;
};

export interface IAttendanceSummaryItem {
  _id: string; // tutorId
  daysPresent: number;
  totalMinutes: number;
  totalHours: number;
  totalSessions: number;
}

// ── HR Notices / Announcements ────────────────────────────────────────────────

export type HRNoticeCategory = "announcement" | "notice";
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
export type IHRNoticesResponse = IApiResponse<IHRNotice[]> & {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  summary: IHRNoticeSummary;
};

// ── Performance / Growth Points (Tutor HR) ───────────────────────────────────

export interface IHRPerformanceRecord {
  id: string;
  tutorId: string;
  month: string;
  year: number;
  G: number;
  R: number;
  O: number;
  W: number;
  T: number;
  H: number;
  totalPoints: number;
  description: string;
  awardedBy: string;
  awardedAt: string;
}

export interface IHRPerformancePayload {
  tutorId: string;
  month: string;
  year: number;
  G: number;
  R: number;
  O: number;
  W: number;
  T: number;
  H: number;
  description: string;
}

export interface IHRGrowthLeaderboardItem {
  tutorId: string;
  tutorName: string;
  totalPoints: number;
  categoryBreakdown: Record<string, number> | null;
  rank: number;
}

export type IHRPerformanceResponse = IApiResponse<IHRPerformanceRecord>;
export type IHRPerformanceListResponse = IApiResponse<IHRPerformanceRecord[]> & { total: number };
export interface IHRGrowthLeaderboardSummary {
  averagePoints: number;
  evaluatedTutors: number;
  topPerformerName: string;
  topPerformerPoints: number;
  totalPointsAwarded: number;
  totalTutors: number;
}

export type IHRGrowthLeaderboardResponse = IApiResponse<IHRGrowthLeaderboardItem[]> & {
  total?: number;
  summary?: IHRGrowthLeaderboardSummary;
};

// keep legacy alias so existing imports don't break
export type ICreateHRPerformancePayload = IHRPerformancePayload;
export type IHRPerformanceEvaluation = IHRPerformanceRecord;

// ── Reports ───────────────────────────────────────────────────────────────────

export interface IAttendanceSummaryEntry {
  tutorId: string;
  tutorName: string;
  present: number;
  absent: number;
  late: number;
  totalRecords: number;
}

export interface IAttendanceReportRecord {
  id: string;
  tutorId: string;
  studentId: string;
  sessionId: string;
  date: string;
  status: "present" | "absent" | "late" | string;
  createdAt: string;
  tutorName: string;
  remarks?: string;
  session: {
    id: string;
    type: string;
    title: string;
    subject: string;
    scheduledAt: string;
    durationMinutes: number;
    status: string;
  } | null;
}

export interface IAttendanceReportResponse {
  status: string;
  data: {
    limit: number;
    page: number;
    records: IAttendanceReportRecord[];
    summary: IAttendanceSummaryEntry[];
    total: number;
    totalPages: number;
  };
}

export interface ISalaryTutorRef {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subjects?: string[];
  experience?: string;
  status?: string;
}

export interface ISalaryRecord {
  id: string;
  tutorId: string;
  month: string;
  year: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: "paid" | "partial" | "unpaid" | string;
  remarks?: string;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
  tutor: ISalaryTutorRef | null;
}

export interface ISalaryReportData {
  limit: number;
  page: number;
  records: ISalaryRecord[];
  total: number;
  totalAmount: number;
  totalPages: number;
  totalPaid: number;
  totalPending: number;
}

export type ISalaryReportResponse = IApiResponse<ISalaryReportData>;

export interface ISalaryReportQueryParams {
  page?: number;
  limit?: number;
  tutorId?: string;
  month?: string;
  year?: number;
  status?: "paid" | "partial" | "pending";
}

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

export interface ITurnoverTutorRef {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subjects?: string[];
  status?: string;
}

export interface ITurnoverData {
  active: number;
  inactive: number;
  resigned: number;
  pending: number;
  total: number;
  turnoverRate: number;
  monthly: ITurnoverMonthEntry[];
  tutors: {
    active: ITurnoverTutorRef[];
    inactive: ITurnoverTutorRef[];
    pending: ITurnoverTutorRef[];
    resigned: ITurnoverTutorRef[];
  };
}

export type ITurnoverReportResponse = IApiResponse<ITurnoverData>;

// ── Salary Management (CRUD via /hr/tutors/salary) ───────────────────────────

export interface IHRSalaryTutorRef {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subjects?: string[];
  status?: string;
}

export interface IHRSalaryRecord {
  id: string;
  month: string;
  year: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: "paid" | "partial" | "unpaid" | string;
  remarks?: string;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
  tutorId: IHRSalaryTutorRef | null;
}

export interface ICreateHRSalaryPayload {
  tutorId: string;
  month: string;
  year: number;
  totalAmount: number;
  paidAmount: number;
  remarks?: string;
}

export interface IUpdateHRSalaryPayload {
  month?: string;
  year?: number;
  paidAmount?: number;
}

export interface IHRSalaryListResponse {
  status: string;
  data: IHRSalaryRecord[];
}

// ── Query helpers ─────────────────────────────────────────────────────────────

export interface IHRAttendanceQueryParams {
  tutorId?: string;
  search?: string;
  date?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface IHRNoticeQueryParams {
  search?: string;
  category?: HRNoticeCategory;
  audience?: string;
  priority?: HRNoticePriority;
  page?: number;
  limit?: number;
}

export interface IHRNoticeSummary {
  category: Record<string, number>;
  priority: Record<HRNoticePriority, number>;
  published: number;
  total: number;
}
