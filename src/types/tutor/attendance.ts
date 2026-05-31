import { IApiResponse } from "@/types/admin/api";

export interface ITutorAttendanceRecord {
  id: string;
  tutorId: string;
  studentId: string;
  sessionId: string;
  date: string;
  status: "present" | "absent" | "late";
  remarks: string;
  createdAt: string;
}

export interface ITutorAttendanceResponse extends IApiResponse<ITutorAttendanceRecord[]> {
  total: number;
}

export interface IMarkAttendanceRecordPayload {
  studentId: string;
  sessionId?: string;
  date: string;
  status: "present" | "absent" | "late";
  remarks?: string;
}

export interface IMarkAttendancePayload {
  records: IMarkAttendanceRecordPayload[];
}

// Session types
export type TutorSessionStatus = "scheduled" | "ongoing" | "completed" | "cancelled";
export type TutorSessionType = "individual" | "group";

export interface ITutorSession {
  id: string;
  tutorId: string;
  type: TutorSessionType;
  studentIds: string[];
  title: string;
  subject: string;
  meetLink: string;
  scheduledAt: string;
  durationMinutes: number;
  status: TutorSessionStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITutorSessionsResponse extends IApiResponse<ITutorSession[]> {
  total: number;
}

export interface ICreateSessionPayload {
  type: TutorSessionType;
  studentIds: string[];
  title: string;
  subject: string;
  meetLink: string;
  scheduledAt: string;
  durationMinutes: number;
  notes: string;
}


