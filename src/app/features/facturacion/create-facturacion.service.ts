import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CreateFacturacionService {
  public readonly setEmisor = signal<number | null>(null);

  public readonly idePersona = signal<number>(0);

  public readonly infoEmisor = signal<any | null>(null);

  public readonly pointCode = signal<string>('');

  public readonly infoCustomer = signal<any | null>(null);

  public readonly products = signal<any[]>([]);

  constructor() {}




  submit() {
    const dataFacturacion = {
      infoEmisor: this.infoEmisor(),
      pointCode: this.pointCode(),
    };
    console.log(dataFacturacion);
  }
}
