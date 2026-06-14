import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/constants/apiClient";
import { QueryParams } from "@/types/queryParams";
import { IApiResponse } from "@/types/admin/api";
import { ITutorAttendanceResponse, IMarkAttendancePayload, ITutorSessionsResponse, ICreateSessionPayload, IUpdateSessionPayload, ITutorSession } from "@/types/tutor/attendance";

export const getTutorAttendance = async (params?: QueryParams) => {
    const res = await apiClient.get<ITutorAttendanceResponse>(ENDPOINTS.GET_TUTOR_ATTENDANCE, { params });
    return res.data;
};

export const markTutorAttendance = async (payload: IMarkAttendancePayload) => {
    const { sessionId, records } = payload;
    let endpoint = ENDPOINTS.MARK_TUTOR_ATTENDANCE;
    if (sessionId) {
        endpoint += `?sessionId=${sessionId}`;
    }
    const res = await apiClient.post<IApiResponse<{ count: number }>>(
        endpoint,
        { records }
    );
    return res.data;
};

export const getSessions = async (params?: QueryParams) => {
    const res = await apiClient.get<ITutorSessionsResponse>(ENDPOINTS.GET_SESSIONS, { params });
    return res.data;
};

export const createTutorSession = async (payload: ICreateSessionPayload) => {
    const res = await apiClient.post<IApiResponse<ITutorSession>>(
        ENDPOINTS.CREATE_SESSION,
        payload
    );
    return res.data;
};

export const updateTutorSession = async (id: string, payload: IUpdateSessionPayload) => {
    const res = await apiClient.put<IApiResponse<ITutorSession>>(
        ENDPOINTS.UPDATE_SESSION(id),
        payload
    );
    return res.data;
};

export const deleteTutorSession = async (id: string) => {
    const res = await apiClient.delete<IApiResponse<any>>(
        ENDPOINTS.DELETE_SESSION(id)
    );
    return res.data;
};