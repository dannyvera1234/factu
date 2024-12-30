import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CreateFacturacionService {
  public readonly setEmisor = signal<number | null>(null);

  constructor() {}
}
