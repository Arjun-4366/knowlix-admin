import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/admin/website/auth";
import { ILoginPayload } from "@/types/admin/auth";

export const ABOUT_KEY = ["about"] as const;

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: ILoginPayload) => login(data),
  });
};
