import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { CreateApplication } from '../interfaces';
import { HttpService } from '../utils/services';
import { environment } from '../../environments/environment.development';
import { PayloadService } from '../utils/services/payload.service';

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

    const payload = this.genericPayloadService.createPayload({ ...createApplication });
    form.append('reqDTO', JSON.stringify(payload));

    return this._http
      .post<void>(`${environment.BASE_API_SISTEMA_CONTABLE}/infoPersona/createEmisor`, { body: form })
      .pipe(map(() => void 0));
  }
}
