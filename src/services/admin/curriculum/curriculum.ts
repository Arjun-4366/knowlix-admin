import { apiClient } from "@/constants/apiClient";
import { ENDPOINTS } from "@/constants/endpoints";
import {
  ICurriculumResponse,
  ICreateCurriculumPayload,
  IUpdateCurriculumPayload,
} from "@/types/admin/curriculum";

// ── Standards ─────────────────────────────────────────────────────────────────
export const getStandards = async () => {
  const res = await apiClient.get<ICurriculumResponse>(ENDPOINTS.GET_STANDARDS);
  return res.data;
};
export const createStandard = async (data: ICreateCurriculumPayload) => {
  const res = await apiClient.post(ENDPOINTS.CREATE_STANDARD, data);
  return res.data;
};
export const updateStandard = async (id: string, data: IUpdateCurriculumPayload) => {
  const res = await apiClient.put(ENDPOINTS.UPDATE_STANDARD(id), data);
  return res.data;
};
export const deleteStandard = async (id: string) => {
  const res = await apiClient.delete(ENDPOINTS.DELETE_STANDARD(id));
  return res.data;
};

// ── Syllabuses ────────────────────────────────────────────────────────────────
export const getSyllabuses = async () => {
  const res = await apiClient.get<ICurriculumResponse>(ENDPOINTS.GET_SYLLABUSES);
  return res.data;
};
export const createSyllabus = async (data: ICreateCurriculumPayload) => {
  const res = await apiClient.post(ENDPOINTS.CREATE_SYLLABUS, data);
  return res.data;
};
export const updateSyllabus = async (id: string, data: IUpdateCurriculumPayload) => {
  const res = await apiClient.put(ENDPOINTS.UPDATE_SYLLABUS(id), data);
  return res.data;
};
export const deleteSyllabus = async (id: string) => {
  const res = await apiClient.delete(ENDPOINTS.DELETE_SYLLABUS(id));
  return res.data;
};

// ── Subjects ──────────────────────────────────────────────────────────────────
export const getSubjects = async () => {
  const res = await apiClient.get<ICurriculumResponse>(ENDPOINTS.GET_SUBJECTS);
  return res.data;
};
export const createSubject = async (data: ICreateCurriculumPayload) => {
  const res = await apiClient.post(ENDPOINTS.CREATE_SUBJECT, data);
  return res.data;
};
export const updateSubject = async (id: string, data: IUpdateCurriculumPayload) => {
  const res = await apiClient.put(ENDPOINTS.UPDATE_SUBJECT(id), data);
  return res.data;
};
export const deleteSubject = async (id: string) => {
  const res = await apiClient.delete(ENDPOINTS.DELETE_SUBJECT(id));
  return res.data;
};
