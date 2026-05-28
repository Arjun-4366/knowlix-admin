import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  assignTutor,
  createStudent,
  deleteStudent,
  getStudent,
  getStudentDocuments,
  getStudents,
  updateStudent,
} from "@/services/admin/students/student";
import {
  IAssignTutorPayload,
  ICreateStudentPayload,
  IUpdateStudentPayload,
} from "@/types/admin/student";
import { QueryParams } from "@/types/queryParams";

const STUDENTS_KEY = ["students"] as const;
const STUDENT_KEY = ["student"] as const;
const STUDENT_DOCUMENTS_KEY = ["student-documents"] as const;

export const useGetStudents = (params?: QueryParams) => {
  return useQuery({
    queryKey: [...STUDENTS_KEY, params],
    queryFn: () => getStudents(params),
  });
};

export const useGetStudent = (id: string) => {
  return useQuery({
    queryKey: [...STUDENT_KEY, id],
    queryFn: () => getStudent(id),
    enabled: !!id,
  });
};

export const useGetStudentDocuments = (studentId: string) => {
  return useQuery({
    queryKey: [...STUDENT_DOCUMENTS_KEY, studentId],
    queryFn: () => getStudentDocuments(studentId),
    enabled: !!studentId,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateStudentPayload) => createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_KEY });
      toast.success("Student created successfully");
    },
    onError: () => toast.error("Failed to create student"),
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateStudentPayload }) =>
      updateStudent(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_KEY });
      queryClient.invalidateQueries({ queryKey: [...STUDENT_KEY, variables.id] });
      toast.success("Student updated successfully");
    },
    onError: () => toast.error("Failed to update student"),
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_KEY });
      toast.success("Student deleted successfully");
    },
    onError: () => toast.error("Failed to delete student"),
  });
};

export const useAssignTutor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IAssignTutorPayload) => assignTutor(data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_KEY });
      queryClient.invalidateQueries({ queryKey: [...STUDENT_KEY, variables.studentId] });
      toast.success("Tutor assigned successfully");
    },
    onError: () => toast.error("Failed to assign tutor"),
  });
};
