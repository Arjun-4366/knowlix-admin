import { IApiResponse } from "@/types/admin/api";
import { IAssignedStudent } from "@/types/tutor/profile";


export type TutorStatus = "pending" | "approved" | "rejected" | string;

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
  positiveRemarks?: string | null;
  negativeRemarks?: string | null;
  slots?: ITutorSlot[] | null;
  assignedStudentIds?: string[] | null;
  createdAt: string;
  updatedAt: string;
  rank?: number;
  syllabus?: string[];
  subjectEntries?: Array<{ name: string; syllabi: string[] }>;
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
  status: TutorStatus;
  profileImage: string;
  permissions: ITutorPermissions;
  syllabus?: string[];
  subjectEntries?: Array<{ name: string; syllabi: string[] }>;
}

export type IUpdateTutorPayload = Partial<ICreateTutorPayload>;

export interface ITutorsResponse extends IApiResponse<ITutor[]> {
  message?: string;
  total?: number;
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
