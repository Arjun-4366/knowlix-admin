import { IApiResponse } from "@/types/admin/api";

import { IStudent } from "@/types/admin/student";

export interface ITutorAttendanceRecord {
  id: string;
  tutorId: { id: string; name: string; email: string } | string;
  studentId: IStudent | string;
  sessionId: ITutorSession | string | null;
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
  date: string;
  status: "present" | "absent" | "late";
  remarks?: string;
}

export interface IMarkAttendancePayload {
  sessionId?: string;
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

export interface IUpdateSessionPayload extends Partial<ICreateSessionPayload> {
  status?: string;
}


