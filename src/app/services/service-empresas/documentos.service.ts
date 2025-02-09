import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Modulos } from '../../utils/permissions';
import { HttpService } from '../../utils/services';
import { PayloadService } from '../../utils/services/payload.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentosService {
  constructor(
    private readonly _http: HttpService,
    private readonly httpClient: HttpClient,
    private genericPayloadService: PayloadService,
  ) {}

  listInvoices(page: number, search: string): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      size: Modulos.PAGE_SIZE,
      page: page,
      search: search,
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

  listProduct(personaRolIde: number, search: string, page: number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      personaRolIde: personaRolIde,
      pageModel: {
        size: Modulos.PAGE_SIZE,
        search: search,
        page: page,
      },
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

  generateCredito(data: Partial<any>): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, { ...data });
    console.log(payload);
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/emission/company/generateInvoiceCredito`, {
      body: payload,
    });
  }


  updateProforma(data: Partial<any>, invoiceIde: number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      invoiceIde,
      dataToUpdate: data,
    });
    return this._http.put(`${environment.BASE_API_SISTEMA_CONTABLE}/emission/company/updateProforma`, {
      body: payload,
    });
  }

  updateProformaSend(data: Partial<any>, invoiceIde: number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      invoiceIde,
      dataToUpdate: data,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/emission/company/updateProformaSend`, {
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

  sendNotificationProforma(id: number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, id);
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/sendNotificationProforma`, {
      body: payload,
    });
  }

  validateInformation(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, '');
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/emission/company/validateInformation`, {
      body: payload,
    });
  }

  editProforma(id: string): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, id);
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/emission/company/retrieveProforma`, {
      body: payload,
    });
  }

  deleteProforma(id: number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, { ideRegister: id });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/deleteProforma`, {
      body: payload,
    });
  }

  deleteInvoice(id: number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, { ideRegister: id });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/deleteInvoice`, {
      body: payload,
    });
  }

  generateLoteProforma(data: Partial<number>): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, { idsInvoices: data });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/generateLoteProforma`, {
      body: payload,
    });
  }

  listInvoicesProformaEnProceso(page: number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      size: Modulos.PAGE_SIZE,
      page: page,
    });
    return this._http.post(
      `${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/listInvoicesProformaEnProceso`,
      {
        body: payload,
      },
    );
  }

  docCount(data: Partial<any>): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      ...data,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/invoice/count`, {
      body: payload,
    });
  }



  generateZipWithDocuments(data: Partial<any>): Observable<Blob> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      ...data,
    });

    return this.httpClient.post(
      `${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/invoice/generateZipWithDocuments`,
      payload,
      { responseType: 'blob' }
    );
  }

}
