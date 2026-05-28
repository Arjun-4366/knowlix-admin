export interface ILoginPayload {
  email: string;
  password: string;
}
export interface ILoginResponse {
  message: string;
  token: string;
  success: boolean;
}
