export interface IdentificationResponse {
  code: number;
  data: IdentificationType[];
  message: string;
  status: string;
}


export interface IdentificationType {
  code: string;
  dateCreate: string;
  description: string;
  ide: number;
  label: string;
  length: number;
  statusRecord: string;
}

