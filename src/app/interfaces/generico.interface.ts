export interface GeneriResp<T> {
  status: string;
  message: string;
  data: T;
  code: number | null;
}
