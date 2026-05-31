import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/constants/apiClient";
import { QueryParams } from "@/types/queryParams";
import { IApiResponse } from "@/types/admin/api";
import { ITutorDashboardPayload } from "@/types/tutor/dashboard";

export const getTutorDashboard = async (params?: QueryParams) => {
    const res = await apiClient.get<IApiResponse<ITutorDashboardPayload>>(ENDPOINTS.GET_TUTOR_DASHBOARD, { params });
    return res.data.data;
};