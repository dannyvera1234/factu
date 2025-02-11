import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Modulos } from '@/utils/permissions';
import { HttpService } from '@/utils/services';
import { PayloadService } from '@/utils/services/payload.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  constructor(
    private readonly _http: HttpService,
    private genericPayloadService: PayloadService,
  ) {}

  listClientes(page: number, search: string): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      size: Modulos.PAGE_SIZE,
      page: page,
      search: search,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/listCustomer`, {
      body: payload,
    });
  }

  addCustomer(data: Partial<any>): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      ...data,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/addCustomer`, {
      body: payload,
    });
  }

  deleteCustomer(ideRegister: number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      ideRegister,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/deleteCustomer`, {
      body: payload,
    });
  }

  updateCustomer(data: Partial<any>): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      ...data,
    });

    return this._http.put(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/updateCustomer`, {
      body: payload,
    });
  }

  detailsCustomer(ideRegister: string): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, ideRegister);

    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/retrieveCustomer`, {
      body: payload,
    });
  }
}
