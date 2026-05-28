import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFaqs, createFaq, deleteFaq } from "@/services/admin/website/faqs";
import { IFaq } from "@/types/admin/faq";
import { toast } from "react-hot-toast";

export const useGetFaqs = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: getFaqs,
    enabled,
  });
};

export const useCreateFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IFaq) => createFaq(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
};

export const useDeleteFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFaq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success("FAQ deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete FAQ");
    },
  });
};
