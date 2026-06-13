import { useQuery } from "@tanstack/react-query";
import { getTutorNotices } from "@/services/tutor/notices";

const TUTOR_NOTICES_KEY = ["tutor-notices"] as const;

export const useGetTutorNotices = () => {
  return useQuery({
    queryKey: TUTOR_NOTICES_KEY,
    queryFn: getTutorNotices,
  });
};
