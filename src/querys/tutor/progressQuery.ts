import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProgressReport,
  fetchProgressReports,
  updateProgressReport,
  deleteProgressReport,
} from "@/services/tutor/progress";
import { ICreateProgressPayload, IUpdateProgressPayload } from "@/types/tutor/progress";

const PROGRESS_KEY = ["tutor-progress"] as const;

export const useGetProgressReports = () => {
  return useQuery({
    queryKey: PROGRESS_KEY,
    queryFn: fetchProgressReports,
  });
};

export const useCreateProgressReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateProgressPayload) => createProgressReport(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROGRESS_KEY });
    },
  });
};

export const useUpdateProgressReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateProgressPayload }) =>
      updateProgressReport(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROGRESS_KEY });
    },
  });
};

export const useDeleteProgressReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProgressReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROGRESS_KEY });
    },
  });
};
