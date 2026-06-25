import { apiClient } from "@/constants/apiClient";
import { ENDPOINTS } from "@/constants/endpoints";
import {
  ICreateNotePayload,
  INotesFiltersResponse,
  INotesQueryParams,
  INotesResponse,
  IUpdateNotePayload,
} from "@/types/admin/notes";

export const getNotes = async (params?: INotesQueryParams) => {
  const res = await apiClient.get<INotesResponse>(ENDPOINTS.GET_NOTES, { params });
  return res.data;
};

const buildNoteFormData = (data: ICreateNotePayload | IUpdateNotePayload) => {
  const fd = new FormData();
  if (data.title !== undefined) fd.append("title", data.title);
  if (data.description !== undefined) fd.append("description", data.description);
  if (data.content !== undefined) fd.append("content", data.content);
  if (data.standard !== undefined) fd.append("standard", data.standard);
  if (data.syllabus !== undefined) fd.append("syllabus", data.syllabus);
  if (data.subject !== undefined) fd.append("subject", data.subject);
  if (data.chapter !== undefined) fd.append("chapter", data.chapter);
  if (data.status !== undefined) fd.append("status", data.status);
  if (data.file) fd.append("file", data.file);
  if (data.tags !== undefined) fd.append("tags", JSON.stringify(data.tags));
  return fd;
};

export const createNote = async (data: ICreateNotePayload) => {
  const res = await apiClient.post(ENDPOINTS.CREATE_NOTE, buildNoteFormData(data));
  return res.data;
};

export const updateNote = async (id: string, data: IUpdateNotePayload) => {
  // If only updating fields with no file, send JSON so tags arrive as a real array.
  if (!data.file) {
    const { file: _file, ...json } = data;
    const res = await apiClient.put(ENDPOINTS.UPDATE_NOTE(id), json);
    return res.data;
  }
  const res = await apiClient.put(ENDPOINTS.UPDATE_NOTE(id), buildNoteFormData(data));
  return res.data;
};

export const deleteNote = async (id: string) => {
  const res = await apiClient.delete(ENDPOINTS.DELETE_NOTE(id));
  return res.data;
};

export const getNotesFilters = async (params?: { subject?: string }) => {
  const res = await apiClient.get<INotesFiltersResponse>(ENDPOINTS.GET_FILTERS, { params });
  return res.data;
};
