import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/constants/apiClient";
import { QueryParams } from "@/types/queryParams";
import { IApiResponse } from "@/types/admin/api";
import { IDashboardPayload } from "@/types/admin/dashboard";

export const getDashboard = async (params?: QueryParams) => {
    const res = await apiClient.get<IApiResponse<IDashboardPayload>>(ENDPOINTS.ADMIN_DASHBOARD, { params });
    return res.data.data;
};