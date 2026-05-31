import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/constants/apiClient";
import { QueryParams } from "@/types/queryParams";
import { IApiResponse } from "@/types/admin/api";
import {
  ICreateExamPayload,
  IEnterExamResultsPayload,
  ITutorExam,
  ITutorExamsResponse,
  IUpdateExamStatusPayload,
} from "@/types/tutor/exams";

export const getTutorExams = async (params?: QueryParams) => {
  const res = await apiClient.get<ITutorExamsResponse>(ENDPOINTS.GET_TUTOR_EXAMS, { params });
  return res.data;
};

export const createTutorExam = async (data: ICreateExamPayload) => {
  const res = await apiClient.post<IApiResponse<ITutorExam>>(ENDPOINTS.CREATE_EXAM, data);
  return res.data;
};

export const updateTutorExamStatus = async (id: string, data: IUpdateExamStatusPayload) => {
  const res = await apiClient.put<IApiResponse<any>>(ENDPOINTS.UPDATE_EXAM_STATUS(id), data);
  return res.data;
};

export const enterTutorExamResults = async (id: string, data: IEnterExamResultsPayload) => {
  const res = await apiClient.post<IApiResponse<any>>(ENDPOINTS.ENTER_EXAM_RESULTS(id), data);
  return res.data;
};
