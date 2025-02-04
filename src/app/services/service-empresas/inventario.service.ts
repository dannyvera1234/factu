import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Modulos } from '@/utils/permissions';
import { HttpService } from '@/utils/services';
import { PayloadService } from '@/utils/services/payload.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  constructor(
    private readonly _http: HttpService,
    private genericPayloadService: PayloadService,
  ) {}

  listoProducto(page: number,search: string): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      size: Modulos.PAGE_SIZE,
      page: page,
      search: search
    });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/listProduct`, {
      body: payload,
    });
  }

  createProducto(data: Partial<any>): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, { ...data });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/addProduct`, {
      body: payload,
    });
  }

  deleteProduct(ideRegister: number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, { ideRegister });
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/deleteProduct`, {
      body: payload,
    });
  }

  updateProduct(data: Partial<any>): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, { ...data });
    return this._http.put(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/updateProduct`, {
      body: payload,
    });
  }
}
