import { Injectable } from '@angular/core';
import { HttpService } from '../utils/services';
import { PayloadService } from '../utils/services/payload.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Modulos } from '../utils/permissions';

@Injectable({
  providedIn: 'root',
})
export class FacturacionService {
  constructor(
    private readonly _http: HttpService,
    private genericPayloadService: PayloadService,
  ) {}

  getListCountersByEmisor(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMISION_DOCUMENTOS_CONTADORES, {});
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/emission/counter/listEmisores`, {
      body: payload,
    });
  }

  getListCountersByCliente(personaRolIde: number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMISION_DOCUMENTOS_CONTADORES, {
      personaRolIde: personaRolIde,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/emission/counter/emisor/listCustomer`, {
      body: payload,
    });
  }
}
