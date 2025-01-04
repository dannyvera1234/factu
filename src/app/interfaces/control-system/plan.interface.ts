interface Characteristic {
  description: string;
  order: number;
}

interface DigitalMedia {
  dateCreate: string;
  dateModify: string | null;
  media: string;
  statusRecord: string;
  usrCreate: number;
  usrModify: number | null;
}

export interface Plan {
  ide: number;
  title: string;
  description: string;
  price: number;
  period: string;
  statusRecord: string;
  favorite: boolean;
  textBtn: string | null;
  url: string | null;
  usrCreate: number;
  usrModify: number | null;
  dateCreate: string;
  dateModify: string | null;
  digitalMedias: DigitalMedia[];
  characteristic: Characteristic[];
}
