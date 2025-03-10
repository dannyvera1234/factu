import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Modulos } from '../../utils/permissions';
import { HttpService } from '../../utils/services';
import { PayloadService } from '../../utils/services/payload.service';

@Injectable({
  providedIn: 'root',
})
export class SubsidiaryService {
  constructor(
    private readonly _http: HttpService,
    private genericPayloadService: PayloadService,
  ) {}

  listSubsidiary(filter: any): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
     ...filter
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/listSubsidiary`, {
      body: payload,
    });
  }

  detailsSubsidiary(ideRegister: string): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI,  ideRegister );
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/retrieveSubsidiary`, {
      body: payload,
    });
  }
}
