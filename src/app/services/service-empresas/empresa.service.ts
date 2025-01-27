import { Injectable } from '@angular/core';
import { HttpService } from '@/utils/services';
import { PayloadService } from '@/utils/services/payload.service';
import { Observable } from 'rxjs';
import { Modulos } from '@/utils/permissions';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  constructor(
    private readonly _http: HttpService,
    private genericPayloadService: PayloadService,
  ) {}

  retrieveEmisor(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, '');
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/retrieveEmisor`, {
      body: payload,
    });
  }

  updateEmisor(infoEmisor: Partial<any>): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      ...infoEmisor,
    });
    return this._http.put(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/infoPersonal`, {
      body: payload,
    });
  }
  updateInfoTributario(infoEmisor: Partial<any>): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      ...infoEmisor,
    });
    return this._http.put(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/infoTributaria`, {
      body: payload,
    });
  }

  createFile(infoFile: Partial<any>, files: File | null): Observable<any> {
    const form = new FormData();

    if (files) {
      form.append('certificate', files);
    }

    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      ...infoFile,
    });
    form.append('reqDTO', JSON.stringify(payload));

    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/addCertificado`, {
      body: form,
    });
  }

  deleteFile(ideRegister: number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      ideRegister: ideRegister,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/deleteCertificado`, {
      body: payload,
    });
  }
  addSubsidiary(data: Partial<any>): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      ...data,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/addSubsidiary`, {
      body: payload,
    });
  }

  deleteSubsidiary(ideRegister: number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      ideRegister: ideRegister,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/deleteSubsidiary`, {
      body: payload,
    });
  }

  updateSubsidiary(data: Partial<any>): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      ...data,
    });
    return this._http.put(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/updateSubsidiary`, {
      body: payload,
    });
  }

  listSequential(enviroment: string): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      environment: enviroment,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/listSequential`, {
      body: payload,
    });
  }

  addSequential(data: Partial<any>, enviroment: string): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      environment: enviroment,
      docsSequential: data,
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/addSequential`, {
      body: payload,
    });
  }

  updateLogo(files: File | null): Observable<any> {
    const form = new FormData();

    if (files) {
      form.append('logo', files);
    }

    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/addPhoto`, {
      body: form,
    });
  }

  deleteLogo(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, '');
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/deletePhoto`, {
      body: payload,
    });
  }
}
