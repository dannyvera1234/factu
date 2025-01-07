import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, of } from 'rxjs';
import { environment } from '@/environments/environment.development';
import { PayloadService } from './payload.service';
import { CreatePlan } from '../../interfaces';
import { Modulos } from '../permissions';

@Injectable({
  providedIn: 'root',
})
export class AccountingControlSystemService {
  constructor(
    private readonly _http: HttpService,
    private genericPayloadService: PayloadService,
  ) {}

  getIdentificationTypes(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_USER, {});
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/util/identificationTypes`, { body: payload });
  }

  getEnvironments(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_USER, {});
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/util/environments`, { body: payload });
  }

  getPersonType(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_USER, null);
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/util/personType`, { body: payload });
  }

  getExtensionCertificate(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_USER, null);
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/util/extensionCertificate`, { body: payload });
  }

  getPlanes(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_USER, {
      descriptionMedia: 'SISTEMA CONTABLE',
      paginator: {},
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/planes/listPlan`, { body: payload });
  }

  createPlanes(data: Partial<CreatePlan>): Observable<void> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_USER, { ...data });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/planes/createPlan`, { body: payload });
  }

  impuestoIVA(label: string): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_EMISORES_CONTADORES, {
      label: label,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/util/tax`, {
      body: payload,
    });
  }

  getTypesProduct(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_USER, '');
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/util/productTypes`, { body: payload });
  }

  getTypesCustomer(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_USER, {});
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/util/identificationTypesCustomer`, {
      body: payload,
    });
  }

  getTypesPayForm(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_UTILS, {});
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/util/payForms`, { body: payload });
  }

  getdocsType(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_EMISORES_CONTADORES, null);
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/util/docsType`, {
      body: payload,
    });
  }
}
