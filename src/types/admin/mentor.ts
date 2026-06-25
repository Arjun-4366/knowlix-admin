import { IApiResponse } from "./api";

export interface IMentor {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  status: "active" | "inactive" | string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateMentorPayload {
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
}

export type IUpdateMentorPayload = Partial<ICreateMentorPayload> & {
  status?: string;
};

export interface IMentorSummary {
  active: number;
  inactive: number;
  total: number;
}

export interface IMentorsResponse extends IApiResponse<IMentor[]> {
  total: number;
  totalPages?: number;
  page?: number;
  limit?: number;
  summary?: IMentorSummary;
}

export type IMentorResponse = IApiResponse<IMentor>;
