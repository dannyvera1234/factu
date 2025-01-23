import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment.development';
import { Modulos } from '@/utils/permissions';
import { HttpService } from '@/utils/services';
import { PayloadService } from '@/utils/services/payload.service';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  constructor(
    private readonly _http: HttpService,
    private genericPayloadService: PayloadService,
  ) {}

  listClientes(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, null);
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


}
