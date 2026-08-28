import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getReviews, createReview, deleteReview } from "@/services/admin/website/reviews";
import { IReview } from "@/types/admin/review";
import { toast } from "react-hot-toast";

export const useGetReviews = () => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: getReviews,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IReview) => createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || "Failed to delete review");
    },
  });
};
