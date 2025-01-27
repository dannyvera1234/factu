import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Modulos } from '@/utils/permissions';
import { HttpService } from '@/utils/services';
import { PayloadService } from '@/utils/services/payload.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(
    private readonly _http: HttpService,
    private genericPayloadService: PayloadService,
  ) {}


  allListCompany(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_EMISORES, {});
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/listEmisores`, {
      body: payload,
    });
  }

  getCompanyByEmisor(personaRolIdeEncrypted: string): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_EMISORES, { personaRolIdeEncrypted });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/admin/retrieveEmisor`, {
      body: payload,
    });
  }
}
