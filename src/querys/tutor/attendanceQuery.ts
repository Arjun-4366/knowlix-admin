import { getTutorAttendance, markTutorAttendance, getSessions, createTutorSession, updateTutorSession, deleteTutorSession } from "@/services/tutor/attendance";
import { QueryParams } from "@/types/queryParams";
import { IMarkAttendancePayload, ICreateSessionPayload } from "@/types/tutor/attendance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const TUTOR_ATTENDANCE_KEY = ["tutor-attendance"] as const;
const TUTOR_SESSIONS_KEY = ["tutor-sessions"] as const;

export const useGetTutorAttendance = (params?: QueryParams) => {
  return useQuery({
    queryKey: [...TUTOR_ATTENDANCE_KEY, params],
    queryFn: () => getTutorAttendance(params),
  });
};

export const useMarkTutorAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IMarkAttendancePayload) => markTutorAttendance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUTOR_ATTENDANCE_KEY });
    },
  });
};

export const useGetSessions = (params?: QueryParams) => {
  return useQuery({
    queryKey: [...TUTOR_SESSIONS_KEY, params],
    queryFn: () => getSessions(params),
  });
};

export const useCreateTutorSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateSessionPayload) => createTutorSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUTOR_SESSIONS_KEY });
    },
  });
};

export const useUpdateTutorSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ICreateSessionPayload }) => updateTutorSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUTOR_SESSIONS_KEY });
    },
  });
};

export const useDeleteTutorSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTutorSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUTOR_SESSIONS_KEY });
    },
  });
};
