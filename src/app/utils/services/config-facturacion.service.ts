import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigFacturacionService {
  public readonly maxEmails = 2;

  public readonly maxPhones = 2;

  public readonly maxBankFiles = 1;

  constructor() {}

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
}
