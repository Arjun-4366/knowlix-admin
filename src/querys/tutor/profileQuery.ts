import { getTutorProfile, updateTutorProfile } from "@/services/tutor/profile";
import { IUpdateTutorProfilePayload } from "@/types/tutor/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const TUTOR_PROFILE_KEY = ["tutor-profile"] as const;

export const useGetTutorProfile = () => {
  return useQuery({
    queryKey: TUTOR_PROFILE_KEY,
    queryFn: () => getTutorProfile(),
  });
};

export const useUpdateTutorProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IUpdateTutorProfilePayload) => updateTutorProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUTOR_PROFILE_KEY });
    },
  });
};
