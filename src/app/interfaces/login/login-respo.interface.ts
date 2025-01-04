export interface LoginResponse {
  code: number;
  data: { token: string };
  message: string;
  status: string;
}
