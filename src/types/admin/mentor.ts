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

export interface IMentorsResponse extends IApiResponse<IMentor[]> {
  total: number;
}

export type IMentorResponse = IApiResponse<IMentor>;
