export interface AllListsProduct {
  auxiliaryCode: string | null;
  availableStock: number;
  description: string;
  ide: number;
  mainCode: string;
  name: string;
  productType: 'PRODUCTO' | 'SERVICIO';
  stock: number;
  subsidiaryIde: number | null;
  tariffCodeIce: string | null;
  tariffCodeIva: string | null;
  tariffDesIva: string;
  unitPrice: number;
}
