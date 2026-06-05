import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  getCoordinators,
  createCoordinator,
  updateCoordinator,
  deleteCoordinator,
} from "@/services/admin/coordinator/coordinator";
import {
  ICreateCoordinatorPayload,
  IUpdateCoordinatorPayload,
} from "@/types/admin/coordinator";
import { QueryParams } from "@/types/queryParams";

const COORDINATORS_KEY = ["coordinators"] as const;
const COORDINATOR_KEY = ["coordinator"] as const;

export const useGetCoordinators = (params?: QueryParams) => {
  return useQuery({
    queryKey: [...COORDINATORS_KEY, params],
    queryFn: () => getCoordinators(params),
  });
};

export const useCreateCoordinator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateCoordinatorPayload) => createCoordinator(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COORDINATORS_KEY });
      toast.success("Coordinator registered successfully");
    },
    onError: () => toast.error("Failed to register coordinator"),
  });
};

export const useUpdateCoordinator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateCoordinatorPayload }) =>
      updateCoordinator(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: COORDINATORS_KEY });
      queryClient.invalidateQueries({ queryKey: [...COORDINATOR_KEY, variables.id] });
      toast.success("Coordinator updated successfully");
    },
    onError: () => toast.error("Failed to update coordinator"),
  });
};

export const useDeleteCoordinator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCoordinator(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COORDINATORS_KEY });
      toast.success("Coordinator deleted successfully");
    },
    onError: () => toast.error("Failed to delete coordinator"),
  });
};
