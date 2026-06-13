import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  approveTutor,
  awardGrowthPoints,
  createTutor,
  deleteTutor,
  getLeaderboard,
  getTutor,
  getTutorPerformance,
  getTutors,
  updateTutor,
  assignStudentsToTutor,
  getGrowthHistory,
} from "@/services/admin/tutor/tutor";
import {
  ICreateTutorPayload,
  IUpdateTutorPayload,
  IAwardGrowthPointsPayload,
  ILeaderboardResponse,
  IAssignStudentsPayload,
} from "@/types/admin/tutor";
import { QueryParams } from "@/types/queryParams";

const TUTORS_KEY = ["tutors"] as const;
const TUTOR_KEY = ["tutor"] as const;
const TUTOR_PERFORMANCE_KEY = ["tutor-performance"] as const;
const LEADERBOARD_KEY = ["leaderboard"] as const;
const GROWTH_HISTORY_KEY = ["growth-history"] as const;

export const useGetLeaderboard = () => {
  return useQuery({
    queryKey: LEADERBOARD_KEY,
    queryFn: () => getLeaderboard(),
  });
};

export const useGetTutors = (params?: QueryParams) => {
  return useQuery({
    queryKey: [...TUTORS_KEY, params],
    queryFn: () => getTutors(params),
  });
};

export const useGetTutor = (id: string) => {
  return useQuery({
    queryKey: [...TUTOR_KEY, id],
    queryFn: () => getTutor(id),
    enabled: !!id,
  });
};

export const useGetTutorPerformance = (id: string) => {
  return useQuery({
    queryKey: [...TUTOR_PERFORMANCE_KEY, id],
    queryFn: () => getTutorPerformance(id),
    enabled: !!id,
  });
};

export const useCreateTutor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateTutorPayload) => createTutor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUTORS_KEY });
      toast.success("Tutor registered successfully");
    },
    onError: () => toast.error("Failed to register tutor"),
  });
};

export const useUpdateTutor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateTutorPayload }) =>
      updateTutor(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: TUTORS_KEY });
      queryClient.invalidateQueries({ queryKey: [...TUTOR_KEY, variables.id] });
      toast.success("Tutor updated successfully");
    },
    onError: () => toast.error("Failed to update tutor"),
  });
};

export const useDeleteTutor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTutor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUTORS_KEY });
      toast.success("Tutor deleted successfully");
    },
    onError: () => toast.error("Failed to delete tutor"),
  });
};

export const useApproveTutor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status?: "approved" | "rejected" }) =>
      approveTutor(id, status),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: TUTORS_KEY });
      queryClient.invalidateQueries({ queryKey: [...TUTOR_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [...TUTOR_PERFORMANCE_KEY, variables.id] });
      toast.success(`Tutor status updated successfully`);
    },
    onError: () => toast.error("Failed to update tutor status"),
  });
};


export const useAwardGrowthPoints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IAwardGrowthPointsPayload) => awardGrowthPoints(data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: TUTORS_KEY });
      queryClient.invalidateQueries({ queryKey: [...TUTOR_KEY, variables.tutorId] });
      queryClient.invalidateQueries({ queryKey: [...TUTOR_PERFORMANCE_KEY, variables.tutorId] });
      toast.success("Growth points awarded successfully");
    },
    onError: () => toast.error("Failed to award growth points"),
  });
};

export const useAssignStudentsToTutor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: IAssignStudentsPayload }) =>
      assignStudentsToTutor(id, payload),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: TUTORS_KEY });
      queryClient.invalidateQueries({ queryKey: [...TUTOR_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Students assigned successfully");
    },
    onError: () => toast.error("Failed to assign students"),
  });
};

export const useGetGrowthHistory = (params: { tutorId: string; month?: string; year?: number }) => {
  return useQuery({
    queryKey: [...GROWTH_HISTORY_KEY, params],
    queryFn: () => getGrowthHistory(params),
    enabled: !!params.tutorId,
  });
};
