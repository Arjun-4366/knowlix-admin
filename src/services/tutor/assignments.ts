import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/constants/apiClient";
import { QueryParams } from "@/types/queryParams";
import { ICreateAssignmentPayload, IEvaluateAssignmentPayload, ITutorAssignment, ITutorAssignmentsResponse } from "@/types/tutor/assignments";
import { IApiResponse } from "@/types/admin/api";

export const getTutorAssignments = async (params?: QueryParams) => {
    const res = await apiClient.get<ITutorAssignmentsResponse>(ENDPOINTS.GET_TUTOR_ASSIGNMENTS, { params });
    return res.data;
};

export const createTutorAssignment = async (data: ICreateAssignmentPayload) => {
    const res = await apiClient.post<IApiResponse<ITutorAssignment>>(ENDPOINTS.CREATE_ASSIGNMENTS, data);
    return res.data;
};

export const evaluateTutorAssignment = async (id: string, data: IEvaluateAssignmentPayload) => {
    const res = await apiClient.put<IApiResponse<any>>(ENDPOINTS.EVALUATE_ASSIGNMENTS(id), data);
    return res.data;
};