import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CreateFacturacionService {
  public readonly setEmisor = signal<number | null>(null);

  public readonly idePersona = signal<number>(0);

  constructor() {}
}
