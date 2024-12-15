import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigFacturacionService {
  public readonly maxEmails = 2;

  public readonly maxPhones = 2;

  public readonly maxBankFiles = 1;

  constructor() {}


  public typePerson = signal<Record<string, string>>({
    N: 'Persona Natural',
    J: 'Persona Jurídica',
  });

}
