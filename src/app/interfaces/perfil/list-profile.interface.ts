interface PersonData {
  cellPhone: string;
  dateBirth: string | null;
  dateCreate: string;
  email: string;
  idePersona: number;
  idePersonaRol: number;
  identificationNumber: string;
  lastName: string;
  names: string;
  profile: string;
  socialReason: string | null;
  statusRecord: string;
  typeDocument: string;
  typePerson: string | null;
}

export interface ListProfile {
  status: string;
  message: string;
  data: PersonData[];
}
