import { Injectable } from '@angular/core';
import { HttpService } from '../utils/services';
import { PayloadService } from '../utils/services/payload.service';
import { Observable } from 'rxjs';
import { Modulos } from '../utils/permissions';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegisterCounteWebService {
  constructor(
    private readonly _http: HttpService,
    private genericPayloadService: PayloadService,
  ) {}

  registerCounterWeb(register: Partial<any>): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EJEMPLO, { ...register });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/public/createCounter`, { body: payload });
  }

  registroEmpresa(register: Partial<any>): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EJEMPLO, { ...register });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/public/createCompany`, { body: payload });
  }

  planes() {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      descriptionMedia: 'SISTEMA CONTABLE',
      paginator: {},
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/public/listPlan`, { body: payload });
  }
}
