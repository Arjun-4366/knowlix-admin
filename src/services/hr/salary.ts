import { apiClient } from "@/constants/apiClient";
import { ENDPOINTS } from "@/constants/endpoints";
import {
  ICreateHRSalaryPayload,
  IUpdateHRSalaryPayload,
  IHRSalaryListResponse,
} from "@/types/admin/hr";

export const getHRSalaryList = async () => {
  const res = await apiClient.get<IHRSalaryListResponse>(ENDPOINTS.HR_SALARY_LIST);
  return res.data;
};

export const createHRSalary = async (data: ICreateHRSalaryPayload) => {
  const res = await apiClient.post(ENDPOINTS.HR_SALARY_CREATE, data);
  return res.data;
};

export const updateHRSalary = async (id: string, data: IUpdateHRSalaryPayload) => {
  const res = await apiClient.put(ENDPOINTS.HR_SALARY_UPDATE(id), data);
  return res.data;
};

export const deleteHRSalary = async (id: string) => {
  const res = await apiClient.delete(ENDPOINTS.HR_SALARY_DELETE(id));
  return res.data;
};
