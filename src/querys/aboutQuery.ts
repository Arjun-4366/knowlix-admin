import { createAbout, getAbout } from "@/services/about";
import { IAboutPayload } from "@/types/about";
import { QueryParams } from "@/types/queryParams";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const ABOUT_KEY = ["about"] as const;

export const useGetAbout = (params?: QueryParams) => {
  return useQuery({
    queryKey: [...ABOUT_KEY, params],
    queryFn: () => getAbout(params),
  });
};

export const useCreateAbout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IAboutPayload) => createAbout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ABOUT_KEY });
    },
  });
};
