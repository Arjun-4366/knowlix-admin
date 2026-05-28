import { getDashboard } from "@/services/admin/dashboard/dashboard";
import { QueryParams } from "@/types/queryParams";
import { useQuery } from "@tanstack/react-query";

const DASHBOARD_KEY = ["dashboard"] as const;

export const useGetDashboard = (params?: QueryParams) => {
    return useQuery({
        queryKey: [...DASHBOARD_KEY, params],
        queryFn: () => getDashboard(params),
    });
};