import { createTutorAssignment, evaluateTutorAssignment, getTutorAssignments } from "@/services/tutor/assignments";
import { QueryParams } from "@/types/queryParams";
import { ICreateAssignmentPayload, IEvaluateAssignmentPayload } from "@/types/tutor/assignments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const TUTOR_ASSIGNMENTS_KEY = ["tutor-assignments"] as const;

export const useGetTutorAssignments = (params?: QueryParams) => {
  return useQuery({
    queryKey: [...TUTOR_ASSIGNMENTS_KEY, params],
    queryFn: () => getTutorAssignments(params),
  });
};

export const useCreateTutorAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateAssignmentPayload) => createTutorAssignment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUTOR_ASSIGNMENTS_KEY });
    },
  });
};

export const useEvaluateTutorAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IEvaluateAssignmentPayload }) => evaluateTutorAssignment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUTOR_ASSIGNMENTS_KEY });
    },
  });
};

