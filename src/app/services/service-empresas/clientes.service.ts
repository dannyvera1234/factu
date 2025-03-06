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

  listClientes(filter: any): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      ...filter,
    });

    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/clientes/listCustomer`, {
      body: payload,
    });
  }

  addCustomer(data: Partial<any>): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      ...data,
    });

    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/clientes/addCustomer`, {
      body: payload,
    });
  }

  deleteCustomer(ideRegister: number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      ideRegister,
    });

    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/clientes/deleteCustomer`, {
      body: payload,
    });
  }

  updateCustomer(data: Partial<any>): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      ...data,
    });

    return this._http.put(`${environment.BASE_API_SISTEMA_CONTABLE}/clientes/updateCustomer`, {
      body: payload,
    });
  }

  detailsCustomer(ideRegister: string): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, ideRegister);

    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/clientes/retrieveCustomer`, {
      body: payload,
    });
  }

  docCustomer(customerIde: number, paginator: any): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      customerIde,
      paginator,
    });

    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/clientes/documentos`, {
      body: payload,
    });
  }

  historialPago(id: number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      invoiceIde: id,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/clientes/documentos/letrascredito`, {
      body: payload,
    });
  }

  payLetter(data: Partial<any>, files: File | null): Observable<any> {
    const form = new FormData();

    if (files) {
      form.append('voucher', files);
    }

    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, { ...data });
    form.append('reqDTO', JSON.stringify(payload));

    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/clientes/letracredito/payLetter`, {
      body: form,
    });
  }

  abonoLetter(data: any): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_CLIENTE, {
      ...data,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/clientes/letracredito/abonos`, {
      body: payload,
    });
  }

  resumenPago(id: number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_CLIENTE, id);
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/clientes/creditos/resumen`, {
      body: payload,
    });
  }
}
