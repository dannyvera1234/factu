export interface Characteristic {
  description: string;
  order: number;
}

export interface CreatePlan {
  title: string;
  description: string;
  price: number;
  period: string;
  amount: number;
  characteristic: Characteristic[];
}
