export interface ILoginPayload {
  email: string;
  password: string;
}
export interface ILoginResponse {
  message: string;
  token: string;
  success: boolean;
  role: string;
  user?: {
    email: string;
    name: string;
    role?: string;
    [key: string]: any;
  };
}
