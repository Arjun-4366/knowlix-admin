import { IApiResponse } from "./api";

export interface ICoordinator {
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

export interface ICreateCoordinatorPayload {
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
}

export type IUpdateCoordinatorPayload = Partial<ICreateCoordinatorPayload> & {
  status?: string;
};

export interface ICoordinatorSummary {
  active: number;
  inactive: number;
  total: number;
}

export interface ICoordinatorsResponse extends IApiResponse<ICoordinator[]> {
  total: number;
  totalPages?: number;
  page?: number;
  limit?: number;
  summary?: ICoordinatorSummary;
}

export type ICoordinatorResponse = IApiResponse<ICoordinator>;
