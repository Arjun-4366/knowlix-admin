import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTutorNotices } from "@/services/tutor/notices";
import { QueryParams } from "@/types/queryParams";

const TUTOR_NOTICES_KEY = ["tutor-notices"] as const;

export const useGetTutorNotices = (params?: QueryParams) => {
  return useQuery({
    queryKey: [...TUTOR_NOTICES_KEY, params],
    queryFn: () => getTutorNotices(params),
    placeholderData: keepPreviousData,
  });
};
