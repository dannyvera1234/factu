import { Injectable, Signal, signal } from '@angular/core';
import { HttpService } from '../utils/services';
import { PayloadService } from '../utils/services/payload.service';
import { environment } from '../../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../interfaces';
import { Router } from '@angular/router';
import { Modulos } from '../utils/permissions';

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
    const payload = this.genericPayloadService.createPayload(Modulos.MODULE_LOGIN, { ...login });
    return this._http
      .post<LoginResponse>(`${environment.BASE_API_SISTEMA_CONTABLE}/auth/login`, { body: payload })
      .pipe(
        tap((response) => {
          if (response.status === 'OK') {
            const data = response.data;
            localStorage.setItem('UserData', JSON.stringify(data));
          }
        }),
      );
  }

  getAuthToken(): string {
    const userData = this.getUserData();
    return userData?.token || '';
  }

  getRefreshToken(): string {
    const userData = this.getUserData();
    return userData?.refresh_token || '';
  }

  getUserData(): any | null {
    const userData = localStorage.getItem('UserData');
    return userData ? JSON.parse(userData) : null;
  }
  logout(): void {
    localStorage.removeItem('UserData');
    this.router.navigate(['/login']);
  }
}
