import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPrograms, createProgram, updateProgram, deleteProgram,
  getCoursesByProgram, addCourseToProgram, updateCourse, deleteCourse,
} from "@/services/admin/website/programs";
import { IProgram, ICourse } from "@/types/admin/program";
import { toast } from "react-hot-toast";

const PROGRAM_KEY = ["admin-programs-list"] as const;

// ─── Programs ──────────────────────────────────────────────────────────────

export const useGetPrograms = () =>
  useQuery({ queryKey: PROGRAM_KEY, queryFn: getPrograms });

export const useCreateProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IProgram) => createProgram(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROGRAM_KEY });
      toast.success("Program created successfully");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Failed to create program"),
  });
};

export const useUpdateProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IProgram> }) => updateProgram(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROGRAM_KEY });
      toast.success("Program updated successfully");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Failed to update program"),
  });
};

export const useDeleteProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProgram(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROGRAM_KEY });
      toast.success("Program deleted");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Failed to delete program"),
  });
};

// ─── Courses ───────────────────────────────────────────────────────────────

export const useGetCoursesByProgram = (programId: string) =>
  useQuery({
    queryKey: ["courses-by-program", programId],
    queryFn: () => getCoursesByProgram(programId),
    enabled: !!programId,
  });

export const useAddCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICourse) => addCourseToProgram(data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["courses-by-program", vars.programId] });
      queryClient.invalidateQueries({ queryKey: PROGRAM_KEY });
      toast.success("Course added successfully");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Failed to add course"),
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ICourse> }) => updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses-by-program"] });
      toast.success("Course updated successfully");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Failed to update course"),
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses-by-program"] });
      queryClient.invalidateQueries({ queryKey: PROGRAM_KEY });
      toast.success("Course deleted");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Failed to delete course"),
  });
};
