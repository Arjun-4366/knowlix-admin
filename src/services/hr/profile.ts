import { apiClient } from "@/constants/apiClient";
import { ENDPOINTS } from "@/constants/endpoints";
import { IApiResponse } from "@/types/admin/api";

export interface IHRProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const getHRProfile = async (): Promise<IHRProfile> => {
  const res = await apiClient.get<IApiResponse<IHRProfile>>(ENDPOINTS.HR_PROFILE);
  return res.data.data;
};
