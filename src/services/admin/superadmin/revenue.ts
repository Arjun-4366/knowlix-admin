import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/constants/apiClient";

export interface IRevenueResponse {
  fees: {
    currency: string;
    studentCount: number;
    totalBilled: number;
    totalPaid: number;
    totalPending: number;
  };
  salary: {
    byStatus: { paid: number; partial: number; pending: number };
    currency: string;
    totalAmount: number;
    totalPaid: number;
    totalPending: number;
    tutorCount: number;
  };
}

export const getSuperadminRevenue = async (): Promise<IRevenueResponse> => {
  const res = await apiClient.get<{ data: IRevenueResponse; status: string }>(
    ENDPOINTS.SUPERADMIN_REVENUE
  );
  return res.data.data;
};
