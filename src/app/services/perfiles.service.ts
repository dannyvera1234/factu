import { Injectable } from '@angular/core';
import { HttpService } from '../utils/services';
import { PayloadService } from '../utils/services/payload.service';
import { Observable } from 'rxjs';
import { Modulos } from '../utils/permissions';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PerfilesService {
  constructor(
    private readonly _http: HttpService,
    private genericPayloadService: PayloadService,
  ) {}

  getListPefiles(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_USER, {});
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/listUser`, { body: payload });
  }

  getListProfile(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_USER, '');
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/listProfile`, { body: payload });
  }

  createPerfil(perfil: Partial<any>): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_USER, { ...perfil });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/createUser`, { body: payload });
  }

  getIdentificationUser(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_USER, {});
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/util/identificationTypesUser`, { body: payload });
  }

  deletePerfil(id: Number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_USER, {
      idePersonaRol: id,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/deleteUser`, { body: payload });
  }
}
