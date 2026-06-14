import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/constants/apiClient";
import { QueryParams } from "@/types/queryParams";
import { IApiResponse } from "@/types/admin/api";
import { ITutorDashboardPayload, ITutorSalary } from "@/types/tutor/dashboard";

export const getTutorDashboard = async (params?: QueryParams) => {
    const res = await apiClient.get<IApiResponse<ITutorDashboardPayload>>(ENDPOINTS.GET_TUTOR_DASHBOARD, { params });
    return res.data.data;
};

export const getTutorSalary = async () => {
    const res = await apiClient.get<IApiResponse<ITutorSalary[]>>(ENDPOINTS.GET_TUTOR_SALARY);
    return res.data.data;
};