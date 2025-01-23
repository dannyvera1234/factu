import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateFacturaEmpresaService {

  public readonly setEmisor = signal<number | null>(null);

  public pointCode = signal<string>('001');

  public readonly selectedEstabliecimient = signal('');


constructor() { }

}
