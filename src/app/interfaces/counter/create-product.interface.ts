export interface CreateProduct {
  name: string;
  description: string; // Corregido el typo en "descrption"
  tariffCodeIva: string;
  tariffCodeIce: string | null;
  mainCode: string;
  auxiliaryCode: string;
  unitPrice: number;
  stock: number;
  subsidiaryIde: number | null; // Puede ser null
  personaRolIde: number; // Valor fijo o dinámico
}
