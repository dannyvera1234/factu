import { Injectable, Signal, signal } from '@angular/core';
import { HttpService } from '../utils/services';
import { PayloadService } from '../utils/services/payload.service';
import { environment } from '../../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private readonly _http: HttpService,
    private genericPayloadService: PayloadService,
    private router: Router,
  ) {}

  login(login: Partial<any>): Observable<LoginResponse> {
    const payload = this.genericPayloadService.createPayload({ ...login });
    return this._http
      .post<LoginResponse>(`${environment.BASE_API_SISTEMA_CONTABLE}/auth/login`, { body: payload })
      .pipe(
        tap((response) => {
          if (response.status === 'ERROR') {
            const token = response.data.token;
            localStorage.setItem('Bearer', token);
          }
        }),
      );
  }

  getAuthToken() {
    return localStorage.getItem('Bearer') || '';
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_token') || '';
  }

  logout() {
    localStorage.removeItem('Bearer');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }
}
