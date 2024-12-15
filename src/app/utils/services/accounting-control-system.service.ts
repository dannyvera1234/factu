import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment.development';
import { PayloadService } from './payload.service';

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
}
