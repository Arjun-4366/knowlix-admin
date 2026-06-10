import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/constants/apiClient";
import { QueryParams } from "@/types/queryParams";
import { IApiResponse } from "@/types/admin/api";
import { IStudent } from "@/types/admin/student";
import { ITutorExam, IExamResultEntry } from "@/types/tutor/exams";
import { ITutorSession, ITutorAttendanceRecord } from "@/types/tutor/attendance";

export interface ITutorStudentsResponse extends IApiResponse<IStudent[]> {
  total: number;
}

export interface ITutorStudentDetailData {
  attendanceBySessions: {
    session: ITutorSession | null;
    attendance: ITutorAttendanceRecord[];
  }[];
  attendanceSummary: {
    absent: number;
    late: number;
    present: number;
    total: number;
  };
  exams: (ITutorExam & { result: IExamResultEntry | null })[];
  student: IStudent;
}

export const getTutorStudents = async (params?: QueryParams) => {
  const res = await apiClient.get<ITutorStudentsResponse>(ENDPOINTS.GET_TUTOR_STUDENTS, { params });
  return res.data;
};

export const getTutorStudent = async (id: string) => {
  const res = await apiClient.get<IApiResponse<ITutorStudentDetailData>>(ENDPOINTS.GET_TUTOR_STUDENT(id));
  return res.data.data;
};

