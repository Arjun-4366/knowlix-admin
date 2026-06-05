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

export interface ICoordinatorsResponse extends IApiResponse<ICoordinator[]> {
  total: number;
}

export type ICoordinatorResponse = IApiResponse<ICoordinator>;
