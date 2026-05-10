import { ILoginPayload, ILoginResponse } from "@/types/auth";

import { ENDPOINTS } from "@/constants/endpoints";
import apiClient from "@/constants/apiClient";

export const login = async (data: ILoginPayload) => {
  const res = await apiClient.post<ILoginResponse>(ENDPOINTS.LOGIN, data);
  return res.data;
};

