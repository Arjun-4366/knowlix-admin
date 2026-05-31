import { getTutorStudents, getTutorStudent } from "@/services/tutor/students";
import { QueryParams } from "@/types/queryParams";
import { useQuery } from "@tanstack/react-query";

const TUTOR_STUDENTS_KEY = ["tutor-students"] as const;

export const useGetTutorStudents = (params?: QueryParams) => {
  return useQuery({
    queryKey: [...TUTOR_STUDENTS_KEY, params],
    queryFn: () => getTutorStudents(params),
  });
};

export const useGetStudent = (id: string) => {
  return useQuery({
    queryKey: [...TUTOR_STUDENTS_KEY, id],
    queryFn: () => getTutorStudent(id),
  });
};

