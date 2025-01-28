import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Modulos } from '../../utils/permissions';
import { HttpService } from '../../utils/services';
import { PayloadService } from '../../utils/services/payload.service';
import { environment } from '../../../environments/environment';

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

  listProforma(page: number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      size: Modulos.PAGE_SIZE,
      page: page,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/listInvoicesProforma`, {
      body: payload,
    });
  }

  subsidiaries(personaRolIde: number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      personaRolIde: personaRolIde,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/emission/company/subsidiaries`, {
      body: payload,
    });
  }

  listProduct(personaRolIde: number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      personaRolIde: personaRolIde,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/emission/company/listProduct`, {
      body: payload,
    });
  }

  generateInvoice(data: Partial<any>): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, { ...data });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/emission/company/generateInvoice`, {
      body: payload,
    });
  }

  generateProforma(data: Partial<any>): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, { ...data });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/emission/company/generateProforma`, {
      body: payload,
    });
  }
  sendNotification(id: number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, id);
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/sendNotification`, {
      body: payload,
    });
  }

  validateInformation(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, '');
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/emission/company/validateInformation`, {
      body: payload,
    });
  }
}
