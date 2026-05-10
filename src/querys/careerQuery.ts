import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getCareersAdmin, createCareer, updateCareer, deleteCareer,
  getApplications, updateApplicationStatus, deleteApplication 
} from "@/services/careers";
import { ICareer, ApplicationStatus } from "@/types/career";
import { toast } from "react-hot-toast";

// Careers
export const useGetCareersAdmin = () => {
  return useQuery({
    queryKey: ["careers-admin"],
    queryFn: getCareersAdmin,
  });
};

export const useCreateCareer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICareer) => createCareer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["careers-admin"] });
      toast.success("Job posting created successfully");
    },
    onError: () => toast.error("Failed to create job posting"),
  });
};

export const useUpdateCareer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ICareer> }) => updateCareer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["careers-admin"] });
      toast.success("Job posting updated");
    },
    onError: () => toast.error("Failed to update job posting"),
  });
};

export const useDeleteCareer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCareer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["careers-admin"] });
      toast.success("Job posting removed");
    },
    onError: () => toast.error("Failed to delete job posting"),
  });
};

// Applications
export const useGetApplications = () => {
  return useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) => updateApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Application status updated");
    },
    onError: () => toast.error("Failed to update application status"),
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Application removed");
    },
    onError: () => toast.error("Failed to delete application"),
  });
};
