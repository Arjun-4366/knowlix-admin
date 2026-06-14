import { getTutorDashboard, getTutorSalary } from "@/services/tutor/dashboard";
import { QueryParams } from "@/types/queryParams";
import { useQuery } from "@tanstack/react-query";

const TUTOR_DASHBOARD_KEY = ["tutor-dashboard"] as const;
const TUTOR_SALARY_KEY = ["tutor-salary"] as const;

export const useGetTutorDashboard = (params?: QueryParams) => {
    return useQuery({
        queryKey: [...TUTOR_DASHBOARD_KEY, params],
        queryFn: () => getTutorDashboard(params),
    });
};

export const useGetTutorSalary = () => {
    return useQuery({
        queryKey: TUTOR_SALARY_KEY,
        queryFn: getTutorSalary,
    });
};