import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigFacturacionService {
  public readonly maxEmails = 2;

  public readonly maxPhones = 2;

  public readonly maxBankFiles = 1;

  constructor() {}

  public CategoriaCostoEnum  = signal<Record<string, string>>({
    G: 'Gasto',
    C: 'Costo',
  });

  public  rimpe = signal<Record<string, string>>({
    'true': 'Sí',
    'false': 'No',
  });


  public environmentCode = signal<Record<string, string>>({
    '1': 'Pruebas',
    '2': 'Producción',
  });

  public typePerson = signal<Record<string, string>>({
    N: 'Persona Natural',
    J: 'Persona Jurídica',
  });

  public readonly documentType = signal<Record<string, string>>({
    '01': 'Factura',
    '03': 'Nota de venta',
    '04': 'Nota de crédito',
    '05': 'Otro',
  });

  public readonly buyType = signal<Record<string, string>>({
      '01': 'Costo',
      '02': 'Gasto',
  });


  public readonly paymentMethod = signal<Record<string, string>>({
    '00': 'Credito',
    '01': 'Efectivo',
    '02': 'Cheque',
    '03': 'Transferencia',
    '04': 'Tarjeta de crédito',
    '05': 'Tarjeta de debito',
    '06': 'Otros',
  });


  public readonly DOCUMENT_STYLES = signal<Record<string, { bgColor: string; icon: string }>>({
    'Factura': {
      bgColor: 'bg-blue-500',
      icon: '/assets/icon/file.svg',
    },
    'Nota de venta': {
      bgColor: 'bg-green-500',
      icon: '/assets/icon/sales-note.svg',
    },
    'Nota de crédito': {
      bgColor: 'bg-purple-500',
      icon: '/assets/icon/credit-note.svg',
    },

    Otro: {
      bgColor: 'bg-gray-500',
      icon: '/assets/icon/other.svg',
    },
  });

  getDocumentStyle(docCode: string) {
    const docType = this.documentType()[docCode]; // Convierte el código al tipo
    return this.DOCUMENT_STYLES()[docType]; // Devuelve los estilos
  }
}
