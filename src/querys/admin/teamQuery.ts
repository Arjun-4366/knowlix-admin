import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTeam, createTeamMember, updateTeamMember, deleteTeamMember } from "@/services/admin/website/team";
import { ITeamMember } from "@/types/admin/team";
import { toast } from "react-hot-toast";

export const useGetTeam = () => {
  return useQuery({
    queryKey: ["team"],
    queryFn: getTeam,
  });
};

export const useCreateTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ITeamMember) => createTeamMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });
};

export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ITeamMember }) => updateTeamMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });
};

export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTeamMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      toast.success("Member removed from team");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || "Failed to remove team member");
    },
  });
};
