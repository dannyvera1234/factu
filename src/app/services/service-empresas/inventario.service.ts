import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment.development';
import { Modulos } from '@/utils/permissions';
import { HttpService } from '@/utils/services';
import { PayloadService } from '@/utils/services/payload.service';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  constructor(
    private readonly _http: HttpService,
    private genericPayloadService: PayloadService,
  ) {}

  listoProducto(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {});
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
