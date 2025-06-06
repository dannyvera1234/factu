import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Modulos } from '../../utils/permissions';
import { HttpService } from '../../utils/services';
import { PayloadService } from '../../utils/services/payload.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmisionService {

 constructor(
    private readonly _http: HttpService,
    private genericPayloadService: PayloadService,
  ) {}

  listCustomer(personaRolIde:number, search: string, page: number): Observable<any> {
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_EMISON_EMPRESA, {
      personaRolIde: personaRolIde,
      paginator:{
        size: 5,
        search: search,
        page: page,
      }

    });

    return this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/emission/company/listCustomer`, {
      body: payload,
    });
  }

}
