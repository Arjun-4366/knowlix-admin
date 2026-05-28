import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getEnquiries, updateEnquiryStatus, deleteEnquiry } from "@/services/admin/website/enquiries";
import { EnquiryStatus } from "@/types/admin/enquiry";
import { toast } from "react-hot-toast";

export const useGetEnquiries = () => {
  return useQuery({
    queryKey: ["enquiries"],
    queryFn: getEnquiries,
  });
};

export const useUpdateEnquiryStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: EnquiryStatus }) => updateEnquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      toast.success("Enquiry status updated");
    },
    onError: () => {
      toast.error("Failed to update enquiry status");
    },
  });
};

export const useDeleteEnquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEnquiry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      toast.success("Enquiry deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete enquiry");
    },
  });
};
