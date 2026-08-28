import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  getMentors,
  createMentor,
  updateMentor,
  deleteMentor,
} from "@/services/admin/mentor/mentor";
import {
  ICreateMentorPayload,
  IUpdateMentorPayload,
} from "@/types/admin/mentor";
import { QueryParams } from "@/types/queryParams";

const MENTORS_KEY = ["mentors"] as const;
const MENTOR_KEY = ["mentor"] as const;

export const useGetMentors = (params?: QueryParams) => {
  return useQuery({
    queryKey: [...MENTORS_KEY, params],
    queryFn: () => getMentors(params),
  });
};

export const useCreateMentor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateMentorPayload) => createMentor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENTORS_KEY });
      toast.success("Mentor registered successfully");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Failed to register mentor"),
  });
};

export const useUpdateMentor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateMentorPayload }) =>
      updateMentor(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: MENTORS_KEY });
      queryClient.invalidateQueries({ queryKey: [...MENTOR_KEY, variables.id] });
      toast.success("Mentor updated successfully");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Failed to update mentor"),
  });
};

export const useDeleteMentor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMentor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENTORS_KEY });
      toast.success("Mentor deleted successfully");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Failed to delete mentor"),
  });
};
