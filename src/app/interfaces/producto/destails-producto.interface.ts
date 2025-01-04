export interface DetailsProducto {
  ide: string;
  mainCode: string;
  auxiliaryCode: string;
  name: string;
  description: string;
  productType: string;
  cantidad: number;
  unitPrice: number;
  tariffCodeIva: string;
  tariffIva: number;
  tariffDesIva: number;
  valorIVA: number;
  tariffCodeIce: string;
  tariffAdValoremIce: number;
  tariffSpecificIce: number;
  tariffDesICE: number;
  valorICE: number;
  subTotal: number;
  valorTotal: number;
}
