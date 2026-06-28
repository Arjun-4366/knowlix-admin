import { useQuery } from "@tanstack/react-query";
import { getSuperadminRevenue } from "@/services/admin/superadmin/revenue";

export const useGetSuperadminRevenue = () => {
  return useQuery({
    queryKey: ["superadmin-revenue"],
    queryFn: getSuperadminRevenue,
    staleTime: 2 * 60 * 1000,
  });
};
