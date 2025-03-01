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

  listaProveedor(filter:any): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {...filter});
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/proveedores/listProveedor`, {
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

  saveXML(data: any,dataTypeBuy:string, files: File | null): Observable<any> {
    const form = new FormData();

    if (files) {
      form.append('invoiceXML', files);
    }
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, {
      factura: data,
      buyType: dataTypeBuy
    });
    form.append('reqDTO', JSON.stringify(payload));
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/proveedores/saveProveedorFromXML`, {
      body: form,
    });
  }

  saveProveedor(data: any): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMPRESA_CONFI, data);
    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/proveedores/saveProveedor`, {
      body: payload,
    });
  }
}
