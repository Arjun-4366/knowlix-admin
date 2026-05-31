import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryParams } from "@/types/queryParams";
import {
  createTutorExam,
  enterTutorExamResults,
  getTutorExams,
  updateTutorExamStatus,
} from "@/services/tutor/exams";
import {
  ICreateExamPayload,
  IEnterExamResultsPayload,
  IUpdateExamStatusPayload,
} from "@/types/tutor/exams";

const TUTOR_EXAMS_KEY = ["tutor-exams"] as const;

export const useGetTutorExams = (params?: QueryParams) => {
  return useQuery({
    queryKey: [...TUTOR_EXAMS_KEY, params],
    queryFn: () => getTutorExams(params),
  });
};

export const useCreateTutorExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateExamPayload) => createTutorExam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUTOR_EXAMS_KEY });
    },
  });
};

export const useUpdateTutorExamStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateExamStatusPayload }) =>
      updateTutorExamStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUTOR_EXAMS_KEY });
    },
  });
};

export const useEnterTutorExamResults = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IEnterExamResultsPayload }) =>
      enterTutorExamResults(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUTOR_EXAMS_KEY });
      // Invalidate dashboard stats since average score might change
      queryClient.invalidateQueries({ queryKey: ["tutor-dashboard"] });
    },
  });
};
