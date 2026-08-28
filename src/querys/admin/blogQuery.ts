import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBlogs, createBlog, updateBlog, deleteBlog } from "@/services/admin/website/blogs";
import { IBlog } from "@/types/admin/blog";
import { toast } from "react-hot-toast";

export const useGetBlogs = () => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IBlog) => createBlog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IBlog) => updateBlog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog post deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || "Failed to delete blog post");
    },
  });
};
