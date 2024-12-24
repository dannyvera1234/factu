import { Injectable } from '@angular/core';
import { HttpService } from '../utils/services';
import { PayloadService } from '../utils/services/payload.service';
import { Modulos } from '../utils/permissions';
import { map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CreateApplication } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class CountersService {
  constructor(
    private readonly _http: HttpService,
    private genericPayloadService: PayloadService,
  ) {}

  getListCounters(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_CONTADORES, {});
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/counter/listCounters`, {
      body: payload,
    });
  }

  createCounter(createCounter: Partial<any>): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_CONTADORES, { ...createCounter });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/counter/createCounter`, {
      body: payload,
    });
  }

  deleteCounter(idePersonaRol: Number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_CONTADORES, {
      idePersonaRol: idePersonaRol,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/counter/deleteCounter`, {
      body: payload,
    });
  }

  createApplicationCounrter(createApplication: Partial<any>, files: File | null): Observable<any> {
    const form = new FormData();

    if (files) {
      form.append('certificate', files);
    }

    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_EMISORES_CONTADORES, {
      ...createApplication,
    });
    form.append('reqDTO', JSON.stringify(payload));
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/counter/createEmisor`, { body: form });
  }

  getListCountersByEmisor(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_EMISORES_CONTADORES, {});
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/counter/listEmisores`, {
      body: payload,
    });
  }

  getCounterByEmisor(personaRolIdeEncrypted: string): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_EMISORES_CONTADORES, {
      personaRolIdeEncrypted: personaRolIdeEncrypted,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/counter/retrieveEmisor`, {
      body: payload,
    });
  }

  updateCounterByEmisor(updateCounter: Partial<any>): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_EMISORES_CONTADORES, {
      ...updateCounter,
    });
    return this._http.put(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/counter/updateEmisor/infoPersonal`, {
      body: payload,
    });
  }

  updateInfoTributario(updateInfoTributario: Partial<any>): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_EMISORES_CONTADORES, {
      ...updateInfoTributario,
    });
    return this._http.put(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/counter/updateEmisor/infoTributaria`, {
      body: payload,
    });
  }

  deleteDoc(ideRegister: number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_EMISORES_CONTADORES, {
      ideRegister: ideRegister,
    });
    return this._http.post(
      `${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/counter/updateEmisor/deleteCertificado`,
      {
        body: payload,
      },
    );
  }

  getListClientes(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_EMISORES_CONTADORES, {});
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/client/listClientes`, {
      body: payload,
    });
  }

  createDoc(infoFile: Partial<any>, files: File | null): Observable<any> {
    const form = new FormData();

    if (files) {
      form.append('certificate', files);
    }

    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_EMISORES_CONTADORES, {
      ...infoFile,
    });
    form.append('reqDTO', JSON.stringify(payload));

    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/counter/updateEmisor/addCertificado`, {
      body: form,
    });
  }
}
