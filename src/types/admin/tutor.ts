import { IApiResponse } from "@/types/admin/api";
import { IAssignedStudent } from "@/types/tutor/profile";
import { ITimetableEntry } from "@/types/admin/timetable";


export type TutorStatus = "pending" | "approved" | "inactive" | "resigned" | string;

export interface ITutorSlot {
  day: string;
  startTime: string;
  endTime: string;
  filled: boolean;
}

export interface ITutor {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  experience: string;
  availability: string | string[];
  role: string;
  status: TutorStatus;
  profileImage: string;
  growthPoints: number;
  performanceScore: number;
  positiveRemarks?: { text: string; addedBy: string; addedAt: string }[];
  negativeRemarks?: { text: string; addedBy: string; addedAt: string }[];
  slots?: ITutorSlot[] | null;
  assignedStudentIds?: string[] | null;
  permissions?: ITutorPermissions;
  createdAt: string;
  updatedAt: string;
  rank?: number;
  syllabus?: string[];
  subjectEntries?: Array<{ name: string; syllabi: string[] }>;
  timetable?: ITimetableEntry[];
}

export interface ITutorPermissions {
  canUploadNotes: boolean;
  canEditNotes: boolean;
  canShareMaterial: boolean;
}

export interface ICreateTutorPayload {
  name: string;
  password?: string;
  email: string;
  phone: string;
  subjects: string[];
  experience: string;
  availability: string[];
  role: string;
  status?: TutorStatus;
  profileImage: string;
  permissions: ITutorPermissions;
  syllabus?: string[];
  subjectEntries?: Array<{ name: string; syllabi: string[] }>;
}

export type IUpdateTutorPayload = Partial<ICreateTutorPayload>;

export interface ITutorSummary {
  approved: number;
  inactive: number;
  pending: number;
  resigned: number;
  total: number;
}

export interface ITutorsResponse extends IApiResponse<ITutor[]> {
  message?: string;
  total?: number;
  totalPages?: number;
  page?: number;
  limit?: number;
  summary?: ITutorSummary;
}

export type ITutorResponse = IApiResponse<ITutor>;

export interface ITutorDetailsData {
  attendanceRate: number;
  conducted: number;
  growthBreakdown: Record<string, number>;
  notConducted: number;
  postponed: number;
  totalGrowthPoints: number;
  totalSessions: number;
  tutor: ITutor;
  assignedStudents?: IAssignedStudent[];
}

export type ITutorDetailsResponse = IApiResponse<ITutorDetailsData>;

export interface IAwardGrowthPointsPayload {
  tutorId: string;
  month: string;
  year: number;
  evaluationArea: string;
  G: number;
  R: number;
  O: number;
  W: number;
  T: number;
  H: number;
  description: string;
}

export interface ILeaderboardItem {
  tutorId: string;
  tutorName: string;
  totalPoints: number;
  categoryBreakdown: Record<string, number> | null;
  rank: number;
}

export interface ILeaderboardResponse extends IApiResponse<ILeaderboardItem[]> {
  total?: number;
}

export interface IAssignStudentsPayload {
  add?: string[];
  remove?: string[];
}

export interface IGrowthHistoryItem {
  id: string;
  tutorId: string;
  month: string;
  year: number;
  evaluationArea: string;
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

export interface IGrowthHistoryResponse extends IApiResponse<IGrowthHistoryItem[]> {
  total?: number;
}

export interface ITutorSubject {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITutorSubjectsResponse extends IApiResponse<ITutorSubject[]> {
  total: number;
  tutorName: string;
}
