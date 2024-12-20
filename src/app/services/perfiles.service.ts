import { Injectable } from '@angular/core';
import { HttpService } from '../utils/services';
import { PayloadService } from '../utils/services/payload.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Modulos } from '../utils/permissions';
import { Profile } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class PerfilesService {
  constructor(
    private readonly _http: HttpService,
    private genericPayloadService: PayloadService,
  ) {}

  getListPefiles(): Observable<any> {
    const specificData = { module: Modulos.MODULE_REGISTRO_USER };
    const payload = this.genericPayloadService.createPayload(specificData);
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/listUser`, { body: payload });
  }

  getListProfile(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_USER);
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/listProfile`, { body: payload });
  }

  createPerfil(perfil: Partial<any>): Observable<any> {
    console.log(perfil);
    const payload = this.genericPayloadService.createPayload({ ...perfil });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/createUser`, { body: payload });
  }

  getIdentificationUser(): Observable<any> {
    const payload = this.genericPayloadService.createPayload({});
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/util/identificationTypesUser`, { body: payload });
  }

  deletePerfil(id: Number): Observable<any> {
    const payload = this.genericPayloadService.createPayload({
      idePersonaRol: id,
      module: Modulos.MODULE_REGISTRO_USER,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/deleteUser`, { body: payload });
  }
}
