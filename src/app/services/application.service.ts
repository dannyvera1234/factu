import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CreateApplication } from '../interfaces';
import { HttpService } from '../utils/services';
import { PayloadService } from '../utils/services/payload.service';
import { Modulos } from '../utils/permissions';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  constructor(
    private readonly _http: HttpService,
    private genericPayloadService: PayloadService,
  ) {}

  createApplication(createApplication: Partial<CreateApplication>, files: File | null): Observable<void> {
    const form = new FormData();

    if (files) {
      form.append('certificate', files);
    }

    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_REGISTRO_CONTADORES, {
      ...createApplication,
    });
    form.append('reqDTO', JSON.stringify(payload));
    return of(void 0);
    //   return this._http
    //     .post<void>(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/createEmisor`, { body: form })
    //     .pipe(map(() => void 0));
  }
}
