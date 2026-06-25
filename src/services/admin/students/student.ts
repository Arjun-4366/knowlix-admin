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
    IStudentSessionsResponse,
    IStudentExamsResponse,
    IStudentAssignmentsResponse,
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
    const formData = new FormData();
    formData.append("studentName", data.studentName);
    formData.append("parentName", data.parentName);
    formData.append("class", data.class);
    if (data.email) formData.append("email", data.email);
    if (data.phone) formData.append("phone", data.phone);
    if (data.password) formData.append("password", data.password);
    formData.append("place", data.place);
    if (data.courseType) formData.append("courseType", data.courseType);
    formData.append("package", data.package);
    if (data.customPackageDetails) formData.append("customPackageDetails", data.customPackageDetails);
    formData.append("admissionStatus", data.admissionStatus);
    
    if (data.mentorId) formData.append("mentorId", data.mentorId);
    if (data.coordinatorId) formData.append("coordinatorId", data.coordinatorId);
    if (data.programId) formData.append("programId", data.programId);
    if (data.courseId) formData.append("courseId", data.courseId);
    if (data.syllabus) formData.append("syllabus", data.syllabus);
    
    if (data.totalFee !== undefined) formData.append("totalFee", data.totalFee.toString());
    if (data.paidAmount !== undefined) formData.append("paidAmount", data.paidAmount.toString());

    if (data.documents) {
        if (data.documents.birthCertificate) {
            formData.append("birthCertificate", data.documents.birthCertificate);
        }
        if (data.documents.transferCertificate) {
            formData.append("transferCertificate", data.documents.transferCertificate);
        }
        if (data.documents.previousAcademicRecord) {
            formData.append("previousAcademicRecord", data.documents.previousAcademicRecord);
        }
        if (data.documents.identificationDocument) {
            formData.append("identificationDocument", data.documents.identificationDocument);
        }
    }

    const res = await apiClient.post<IStudentResponse>(ENDPOINTS.ADD_STUDENT, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const updateStudent = async (id: string, data: IUpdateStudentPayload) => {
    const formData = new FormData();
    if (data.studentName) formData.append("studentName", data.studentName);
    if (data.parentName) formData.append("parentName", data.parentName);
    if (data.class) formData.append("class", data.class);
    if (data.email) formData.append("email", data.email);
    if (data.phone) formData.append("phone", data.phone);
    if (data.password) formData.append("password", data.password);
    if (data.place) formData.append("place", data.place);
    if (data.courseType) formData.append("courseType", data.courseType);
    if (data.package) formData.append("package", data.package);
    if (data.customPackageDetails !== undefined) formData.append("customPackageDetails", data.customPackageDetails);
    if (data.admissionStatus) formData.append("admissionStatus", data.admissionStatus);
    if (data.mentorId) formData.append("mentorId", data.mentorId);
    if (data.coordinatorId) formData.append("coordinatorId", data.coordinatorId);
    if (data.programId) formData.append("programId", data.programId);
    if (data.courseId) formData.append("courseId", data.courseId);
    if (data.syllabus) formData.append("syllabus", data.syllabus);
    
    if (data.totalFee !== undefined) formData.append("totalFee", data.totalFee.toString());
    if (data.paidAmount !== undefined) formData.append("paidAmount", data.paidAmount.toString());

    if (data.documents) {
        if (data.documents.birthCertificate) {
            formData.append("birthCertificate", data.documents.birthCertificate);
        }
        if (data.documents.transferCertificate) {
            formData.append("transferCertificate", data.documents.transferCertificate);
        }
        if (data.documents.previousAcademicRecord) {
            formData.append("previousAcademicRecord", data.documents.previousAcademicRecord);
        }
        if (data.documents.identificationDocument) {
            formData.append("identificationDocument", data.documents.identificationDocument);
        }
    }

    const res = await apiClient.put<IStudentResponse>(`${ENDPOINTS.UPDATE_STUDENT}/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
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

export const getStudentSessions = async (id: string, params?: { page?: number; limit?: number }) => {
    const res = await apiClient.get<IStudentSessionsResponse>(ENDPOINTS.GET_STUDENT_SESSIONS(id), { params });
    return res.data;
};

export const getStudentExams = async (id: string, params?: { page?: number; limit?: number }) => {
    const res = await apiClient.get<IStudentExamsResponse>(ENDPOINTS.GET_STUDENT_EXAMS(id), { params });
    return res.data;
};

export const getStudentAssignments = async (id: string, params?: { page?: number; limit?: number }) => {
    const res = await apiClient.get<IStudentAssignmentsResponse>(ENDPOINTS.GET_ADMIN_STUDENT_ASSIGNMENTS(id), { params });
    return res.data;
};

export const assignTutor = async ({ studentId, tutorId }: IAssignTutorPayload) => {
    const res = await apiClient.put<IApiResponse<IStudent>>(
        ENDPOINTS.ASSIGN_TUTOR(tutorId),
        { studentId, tutorId },
    );
    return res.data;
};
