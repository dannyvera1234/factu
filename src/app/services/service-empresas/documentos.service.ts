import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Modulos } from '../../utils/permissions';
import { HttpService } from '../../utils/services';
import { PayloadService } from '../../utils/services/payload.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentosService {
  constructor(
    private readonly _http: HttpService,
    private genericPayloadService: PayloadService,
  ) {}

  listInvoices(page: number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      size: Modulos.PAGE_SIZE,
      page: page,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/listInvoices`, {
      body: payload,
    });
  }
}
