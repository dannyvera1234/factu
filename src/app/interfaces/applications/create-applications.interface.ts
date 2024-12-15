
export interface  CreateApplication {
  typePerson: string;
  socialReason: string;
  names: string;
  lastName: string;
  typeDocument: string;
  identificationNumber: string;
  email: string;
  cellPhone: string;
  dateBirth: string;
  infoEmisor: Partial<InfoEmisor>;
}

interface InfoEmisor {
  ruc: string;
  environmentCode: string;
  mainAddress: string;
  comercialName: string;
  requiredAccounting: boolean;
  rimpe: boolean;
  retentionAgent: string;
  rimpePopular: boolean;
  specialContributor: string;
  certificatePassword: string;
  subsidiary: Subsidiary;
}

interface Subsidiary {
  code: string;
  email: string;
  address: string;
}
