import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/constants/apiClient";
import { ICareer, ICareerApplication, ICareerResponse, IApplicationResponse, ApplicationStatus } from "@/types/admin/career";
import { IApiResponse } from "@/types/admin/api";

// Careers
export const getCareersAdmin = async () => {
  const res = await apiClient.get<ICareerResponse>(ENDPOINTS.CAREERS_ADMIN_FETCH);
  return res.data;
};

export const createCareer = async (data: ICareer) => {
  const res = await apiClient.post<IApiResponse<ICareer>>(ENDPOINTS.CAREERS_CREATE, data);
  return res.data;
};

export const updateCareer = async (id: string, data: Partial<ICareer>) => {
  const res = await apiClient.put<IApiResponse<null>>(`${ENDPOINTS.CAREERS_UPDATE}/${id}`, data);
  return res.data;
};

export const deleteCareer = async (id: string) => {
  const res = await apiClient.delete<IApiResponse<null>>(`${ENDPOINTS.CAREERS_DELETE}/${id}`);
  return res.data;
};

// Applications
export const getApplications = async () => {
  const res = await apiClient.get<IApplicationResponse>(ENDPOINTS.APPLICATIONS_FETCH);
  return res.data;
};

export const updateApplicationStatus = async (id: string, status: ApplicationStatus) => {
  const res = await apiClient.put<IApiResponse<null>>(`${ENDPOINTS.APPLICATIONS_UPDATE}/${id}`, { status });
  return res.data;
};

export const deleteApplication = async (id: string) => {
  const res = await apiClient.delete<IApiResponse<null>>(`${ENDPOINTS.APPLICATIONS_DELETE}/${id}`);
  return res.data;
};
