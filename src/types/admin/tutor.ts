import { IApiResponse } from "@/types/admin/api";

export interface ITutorPermissions {
  canUploadNotes: boolean;
  canEditNotes: boolean;
  canShareMaterial: boolean;
}

export type TutorStatus = "pending" | "approved" | "rejected" | string;

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
  permissions: ITutorPermissions;
  createdAt: string;
  updatedAt: string;
  rank?: number;
  syllabus?: string[];
  subjectEntries?: Array<{ name: string; syllabi: string[] }>;
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

export interface IAwardGrowthPointsPayload {
  tutorId: string;
  category: string;
  evaluationArea: string;
  points: number;
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


