import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  getStandards, createStandard, updateStandard, deleteStandard,
  getSyllabuses, createSyllabus, updateSyllabus, deleteSyllabus,
  getSubjects, createSubject, updateSubject, deleteSubject,
} from "@/services/admin/curriculum/curriculum";
import { ICreateCurriculumPayload, IUpdateCurriculumPayload } from "@/types/admin/curriculum";

const STANDARDS_KEY = ["standards"] as const;
const SYLLABUSES_KEY = ["syllabuses"] as const;
const SUBJECTS_KEY = ["subjects"] as const;

// ── Standards ─────────────────────────────────────────────────────────────────
export const useGetStandards = () =>
  useQuery({ queryKey: [...STANDARDS_KEY], queryFn: getStandards });

export const useCreateStandard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateCurriculumPayload) => createStandard(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: STANDARDS_KEY }); toast.success("Standard added"); },
    onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Failed to add standard"),
  });
};

export const useUpdateStandard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateCurriculumPayload }) => updateStandard(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: STANDARDS_KEY }); toast.success("Standard updated"); },
    onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Failed to update standard"),
  });
};

export const useDeleteStandard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStandard(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: STANDARDS_KEY }); toast.success("Standard deleted"); },
    onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Failed to delete standard"),
  });
};

// ── Syllabuses ────────────────────────────────────────────────────────────────
export const useGetSyllabuses = () =>
  useQuery({ queryKey: [...SYLLABUSES_KEY], queryFn: getSyllabuses });

export const useCreateSyllabus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateCurriculumPayload) => createSyllabus(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: SYLLABUSES_KEY }); toast.success("Syllabus added"); },
    onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Failed to add syllabus"),
  });
};

export const useUpdateSyllabus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateCurriculumPayload }) => updateSyllabus(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: SYLLABUSES_KEY }); toast.success("Syllabus updated"); },
    onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Failed to update syllabus"),
  });
};

export const useDeleteSyllabus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSyllabus(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: SYLLABUSES_KEY }); toast.success("Syllabus deleted"); },
    onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Failed to delete syllabus"),
  });
};

// ── Subjects ──────────────────────────────────────────────────────────────────
export const useGetSubjects = () =>
  useQuery({ queryKey: [...SUBJECTS_KEY], queryFn: getSubjects });

export const useCreateSubject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateCurriculumPayload) => createSubject(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: SUBJECTS_KEY }); toast.success("Subject added"); },
    onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Failed to add subject"),
  });
};

export const useUpdateSubject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateCurriculumPayload }) => updateSubject(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: SUBJECTS_KEY }); toast.success("Subject updated"); },
    onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Failed to update subject"),
  });
};

export const useDeleteSubject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSubject(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: SUBJECTS_KEY }); toast.success("Subject deleted"); },
    onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Failed to delete subject"),
  });
};
