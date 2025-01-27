import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { CreateEstablecimiento } from '@/interfaces/establecimiento';
import { HttpService } from '../utils/services';
import { PayloadService } from '../utils/services/payload.service';
import { Modulos } from '../utils/permissions';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EstablecimientoService {
  constructor(
    private readonly _http: HttpService,
    private genericPayloadService: PayloadService,
  ) {}

  createEstablecimiento(createEstablecimiento: Partial<CreateEstablecimiento>): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_USER,{ ...createEstablecimiento });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/sender/createSubsidiary`, { body: payload });
  }
}
