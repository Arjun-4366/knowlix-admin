import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/constants/apiClient";
import { QueryParams } from "@/types/queryParams";
import { IApiResponse } from "@/types/admin/api";
import { ITutorProfilePayload, IUpdateTutorProfilePayload } from "@/types/tutor/profile";

export const getTutorProfile = async () => {
    const res = await apiClient.get<IApiResponse<ITutorProfilePayload>>(ENDPOINTS.TUTOR_PROFILE);
    return res.data.data;
};

export const updateTutorProfile = async (data: IUpdateTutorProfilePayload) => {
    const res = await apiClient.put<IApiResponse<ITutorProfilePayload>>(ENDPOINTS.TUTOR_PROFILE, data);
    return res.data.data;
};