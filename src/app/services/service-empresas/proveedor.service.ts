import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Modulos } from '../../utils/permissions';
import { HttpService } from '../../utils/services';
import { PayloadService } from '../../utils/services/payload.service';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
  constructor(
    private readonly _http: HttpService,
    private genericPayloadService: PayloadService,
  ) {}

  listoProveedor(): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {});
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/company/listProduct`, {
      body: payload,
    });
  }

  cargarXML(files: File | null): Observable<any> {
    const form = new FormData();

    if (files) {
      form.append('invoiceXML', files);
    }

    return this._http.post(
      `${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/proveedores/retrieveInformationFromXML`,
      {
        body: form,
      },
    );
  }

  saveXML(data: Partial<any>): Observable<any> {
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/proveedores/saveXML`, {
      body: data,
    });
  }
}
