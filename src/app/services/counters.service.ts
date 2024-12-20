import { Injectable } from '@angular/core';
import { HttpService } from '../utils/services';
import { PayloadService } from '../utils/services/payload.service';
import { Modulos } from '../utils/permissions';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CountersService {
  constructor(
    private readonly _http: HttpService,
    private genericPayloadService: PayloadService,
  ) {}

  getListCounters(): Observable<any> {
    const payload = this.genericPayloadService.createPayload({ module: Modulos.MODULE_REGISTRO_CONTADORES });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/listCounters`, { body: payload });
  }

  createCounter(createCounter: Partial<any>): Observable<any> {
    console.log('createCounter', createCounter);
    const payload = this.genericPayloadService.createPayload({ ...createCounter });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/createCounter`, { body: payload });
  }

  deleteCounter(idePersonaRol: Number): Observable<any> {
    const payload = this.genericPayloadService.createPayload({
      idePersonaRol: idePersonaRol,
      module: Modulos.MODULE_REGISTRO_CONTADORES,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/deleteCounter`, { body: payload });
  }
}
