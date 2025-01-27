import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Modulos } from '../../utils/permissions';
import { HttpService } from '../../utils/services';
import { PayloadService } from '../../utils/services/payload.service';

@Injectable({
  providedIn: 'root',
})
export class PlanesService {
  constructor(
    private readonly _http: HttpService,
    private genericPayloadService: PayloadService,
  ) {}

  listPlan(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_PLANES, {
      descriptionMedia: 'SISTEMA CONTABLE',
      paginator: {},
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/planes/listPlan`, {
      body: payload,
    });
  }

  savePlan(personaRolIde: number, planIde:number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
     personaRolIde,
      planIde,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/admin/company/addPlan`, {
      body: payload,
    });
  }

  info(personaRolIde: number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      personaRolIde,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/admin/company/retrievePlan`, {
      body: payload,
    });
  }
}
