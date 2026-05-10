import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getGalleryItems, addGalleryItem, deleteGalleryItem } from "@/services/gallery";
import { IGalleryItem } from "@/types/gallery";
import { toast } from "react-hot-toast";

export const useGetGallery = () => {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: getGalleryItems,
  });
};

export const useAddGalleryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IGalleryItem) => addGalleryItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success("Gallery item added successfully");
    },
    onError: () => {
      toast.error("Failed to add gallery item");
    },
  });
};

export const useDeleteGalleryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGalleryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success("Gallery item removed");
    },
    onError: () => {
      toast.error("Failed to delete gallery item");
    },
  });
};
