import { apiClient } from "@/constants/apiClient";
import { ENDPOINTS } from "@/constants/endpoints";
import { QueryParams } from "@/types/queryParams";
import { IApiResponse } from "@/types/admin/api";
import {
    IAssignTutorPayload,
    ICreateStudentPayload,
    IStudent,
    IStudentDocumentsResponse,
    IStudentResponse,
    IStudentsResponse,
    IUpdateStudentPayload,
} from "@/types/admin/student";

export const getStudents = async (params?: QueryParams) => {
    const res = await apiClient.get<IStudentsResponse>(ENDPOINTS.GET_STUDENTS, { params });
    return res.data;
};

export const getStudent = async (id: string) => {
    const res = await apiClient.get<IStudentResponse>(ENDPOINTS.GET_STUDENT(id));
    return res.data.data;
};

export const createStudent = async (data: ICreateStudentPayload) => {
    const res = await apiClient.post<IStudentResponse>(ENDPOINTS.ADD_STUDENT, data);
    return res.data;
};

export const updateStudent = async (id: string, data: IUpdateStudentPayload) => {
    const res = await apiClient.put<IStudentResponse>(`${ENDPOINTS.UPDATE_STUDENT}/${id}`, data);
    return res.data;
};

export const deleteStudent = async (id: string) => {
    const res = await apiClient.delete<IApiResponse<null>>(`${ENDPOINTS.DELETE_STUDENT}/${id}`);
    return res.data;
};

export const getStudentDocuments = async (studentId: string) => {
    const res = await apiClient.get<IStudentDocumentsResponse>(ENDPOINTS.GET_STUDENT_DOC(studentId));
    return res.data;
};

export const assignTutor = async ({ studentId, tutorId }: IAssignTutorPayload) => {
    const res = await apiClient.put<IApiResponse<IStudent>>(
        ENDPOINTS.ASSIGN_TUTOR(tutorId),
        { studentId, tutorId },
    );
    return res.data;
};
