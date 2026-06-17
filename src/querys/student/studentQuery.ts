import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryParams } from "@/types/queryParams";
import {
  getStudentDashboard,
  getStudentNotices,
  queryStudentChatbot,
  getStudentSchedule,
  getStudentAssignments,
  submitStudentAssignment,
  getStudentAssignmentStatus,
  getStudentResults,
  getStudentResultsGrades,
  getStudentResultsAnalytics,
  getStudentFees,
  getStudentFeesStatus,
  getStudentProfile,
} from "@/services/student/student";

const STUDENT_KEYS = {
  dashboard: ["student-dashboard"] as const,
  notices: ["student-notices"] as const,
  schedule: ["student-schedule"] as const,
  assignments: ["student-assignments"] as const,
  assignmentStatus: (id: string) => ["student-assignment-status", id] as const,
  results: ["student-results"] as const,
  resultsGrades: ["student-results-grades"] as const,
  resultsAnalytics: ["student-results-analytics"] as const,
  fees: ["student-fees"] as const,
  feesStatus: ["student-fees-status"] as const,
  profile: ["student-profile"] as const,
};

export const useGetStudentDashboard = (params?: QueryParams) => {
  return useQuery({
    queryKey: [...STUDENT_KEYS.dashboard, params],
    queryFn: () => getStudentDashboard(params),
  });
};

export const useGetStudentNotices = (params?: QueryParams) => {
  return useQuery({
    queryKey: [...STUDENT_KEYS.notices, params],
    queryFn: () => getStudentNotices(params),
  });
};

export const useStudentChatbot = () => {
  return useMutation({
    mutationFn: (message: string) => queryStudentChatbot(message),
  });
};

export const useGetStudentSchedule = (params?: QueryParams) => {
  return useQuery({
    queryKey: [...STUDENT_KEYS.schedule, params],
    queryFn: () => getStudentSchedule(params),
  });
};

export const useGetStudentAssignments = (params?: QueryParams) => {
  return useQuery({
    queryKey: [...STUDENT_KEYS.assignments, params],
    queryFn: () => getStudentAssignments(params),
  });
};

export const useSubmitStudentAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, fileUrl, remarks }: { id: string; fileUrl: string; remarks?: string }) =>
      submitStudentAssignment(id, fileUrl, remarks),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.assignments });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.assignmentStatus(variables.id) });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.dashboard });
    },
  });
};

export const useGetStudentAssignmentStatus = (id: string) => {
  return useQuery({
    queryKey: STUDENT_KEYS.assignmentStatus(id),
    queryFn: () => getStudentAssignmentStatus(id),
    enabled: !!id,
  });
};

export const useGetStudentResults = (params?: QueryParams) => {
  return useQuery({
    queryKey: [...STUDENT_KEYS.results, params],
    queryFn: () => getStudentResults(params),
  });
};

export const useGetStudentResultsGrades = (params?: QueryParams) => {
  return useQuery({
    queryKey: [...STUDENT_KEYS.resultsGrades, params],
    queryFn: () => getStudentResultsGrades(params),
  });
};

export const useGetStudentResultsAnalytics = (params?: QueryParams) => {
  return useQuery({
    queryKey: [...STUDENT_KEYS.resultsAnalytics, params],
    queryFn: () => getStudentResultsAnalytics(params),
  });
};

export const useGetStudentFees = (params?: QueryParams) => {
  return useQuery({
    queryKey: [...STUDENT_KEYS.fees, params],
    queryFn: () => getStudentFees(params),
  });
};

export const useGetStudentFeesStatus = (params?: QueryParams) => {
  return useQuery({
    queryKey: [...STUDENT_KEYS.feesStatus, params],
    queryFn: () => getStudentFeesStatus(params),
  });
};

export const useGetStudentProfile = () => {
  return useQuery({
    queryKey: STUDENT_KEYS.profile,
    queryFn: () => getStudentProfile(),
  });
};
