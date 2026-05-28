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
  availability: string;
  role: string;
  status: TutorStatus;
  profileImage: string;
  growthPoints: number;
  performanceScore: number;
  permissions: ITutorPermissions;
  createdAt: string;
  updatedAt: string;
  rank?: number;
}

export interface ICreateTutorPayload {
  name: string;
  password?: string;
  email: string;
  phone: string;
  subjects: string[];
  experience: string;
  availability: string;
  role: string;
  status: TutorStatus;
  profileImage: string;
  permissions: ITutorPermissions;
}

export type IUpdateTutorPayload = Partial<ICreateTutorPayload>;

export interface ITutorsResponse extends IApiResponse<ITutor[]> {
  message?: string;
  total?: number;
}

export type ITutorResponse = IApiResponse<ITutor>;
