import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  createTimetable,
  deleteTimetable,
  getTimetable,
  updateTimetable,
} from "@/services/admin/timetable/timetable";
import {
  ICreateTimetablePayload,
  ITimetableQueryParams,
  IUpdateTimetablePayload,
} from "@/types/admin/timetable";

const TIMETABLE_KEY = ["timetable"] as const;

export const useGetTimetable = (params?: ITimetableQueryParams) => {
  return useQuery({
    queryKey: [...TIMETABLE_KEY, params],
    queryFn: () => getTimetable(params),
  });
};

export const useCreateTimetable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateTimetablePayload) => createTimetable(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TIMETABLE_KEY });
      toast.success("Timetable slot created successfully");
    },
    onError: () => toast.error("Failed to create timetable slot"),
  });
};

export const useUpdateTimetable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateTimetablePayload }) =>
      updateTimetable(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TIMETABLE_KEY });
      toast.success("Timetable slot updated successfully");
    },
    onError: () => toast.error("Failed to update timetable slot"),
  });
};

export const useDeleteTimetable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTimetable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TIMETABLE_KEY });
      toast.success("Timetable slot deleted successfully");
    },
    onError: () => toast.error("Failed to delete timetable slot"),
  });
};
