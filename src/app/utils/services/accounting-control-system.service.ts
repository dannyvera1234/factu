import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, of } from 'rxjs';
import { environment } from '@/environments/environment.development';
import { PayloadService } from './payload.service';
import { CreatePlan } from '../../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AccountingControlSystemService {
  constructor(
    private readonly _http: HttpService,
    private genericPayloadService: PayloadService,
  ) {}

  getIdentificationTypes(): Observable<any> {
    const specificData = {
      listCode: [],
    };
    const payload = this.genericPayloadService.createPayload(specificData);
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/util/identificationTypes`, { body: payload });
  }

  getEnvironments(): Observable<any> {
    const specificData = {};
    const payload = this.genericPayloadService.createPayload(specificData);
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/util/environments`, { body: payload });
  }

  getPersonType(): Observable<any> {
    const specificData = null;
    const payload = this.genericPayloadService.createPayload(specificData);
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/util/personType`, { body: payload });
  }

  getExtensionCertificate(): Observable<any> {
    const specificData = null;
    const payload = this.genericPayloadService.createPayload(specificData);
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/util/extensionCertificate`, { body: payload });
  }

  getPlanes(): Observable<any> {
    const payload = this.genericPayloadService.createPayload({
      descriptionMedia: 'SISTEMA CONTABLE',
      paginator: {},
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/planes/listPlan`, { body: payload });
  }

  createPlanes(data: Partial<CreatePlan>): Observable<void> {
    const payload = this.genericPayloadService.createPayload({...data});
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/planes/createPlan`, { body: payload });
  }
}
