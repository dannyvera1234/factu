import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Modulos } from '../../utils/permissions';
import { HttpService } from '../../utils/services';
import { PayloadService } from '../../utils/services/payload.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  constructor(
    private readonly _http: HttpService,
    private genericPayloadService: PayloadService,
  ) {}

  detailsHome(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, null);
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/detailsHome`, {
      body: payload,
    });
  }
}
