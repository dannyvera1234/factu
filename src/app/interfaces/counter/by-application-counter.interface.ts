export interface Certificate {
  ide: number;
  ideInfoPersonaRol: number;
  name: string;
  fileTypeExtension: string;
  isFavorite: boolean;
}

export interface Subsidiary {
  address: string;
  cellPhone: string | null;
  code: string;
  dateCreate: string;
  dateModify: string | null;
  email: string;
  ideInfoEmisor: number;
  ideSubsidiary: number;
  ruc: string;
  statusRecord: string;
  usrCreate: number;
  usrModify: number | null;
}

export interface ByApplicationCounter {
  photo: string;
  cellPhone: string;
  certificates: Certificate[];
  comercialName: string;
  dateBirth: string;
  dateCreate: string;
  email: string;
  environmentCode: string;
  ideEmisor: number;
  idePersona: number;
  idePersonaRol: number;
  identificationNumber: string;
  lastName: string;
  mainAddress: string;
  names: string;
  profileName: string | null;
  requiredAccounting: boolean;
  retentionAgent: string | null;
  rimpe: boolean;
  rimpePopular: boolean;
  rolName: string;
  ruc: string;
  socialReason: string;
  specialContributor: string;
  statusRecord: string;
  subsidiaries: Subsidiary[];
  typeDocument: string;
  typePerson: string;
  electronicDocuments: boolean | null;
  statement: StatementType | null;
}
type StatementType = {
  certificatePassword?: string;
  file?: File | null;
};
