import { Injectable } from '@angular/core';
import { HttpService } from '../utils/services';
import { PayloadService } from '../utils/services/payload.service';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../interfaces';
import { Router } from '@angular/router';
import { Modulos } from '../utils/permissions';
import { environment } from '../../environments/environment';
import { AuthMock } from '../../assets/mock';

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
    // Usar mock temporal - reemplazar con endpoint real cuando esté disponible
    return AuthMock.login(login as { username: string; password: string }).pipe(
      tap((response) => {
        if (response.status === 'OK') {
          // Los datos completos ya se guardan en el mock
          // Solo verificamos que se guardó correctamente
          const userData = localStorage.getItem('UserData');
          if (!userData) {
            // Fallback: guardar datos mínimos si no se guardaron
            const mockUserData = {
              token: response.data.token,
              permission: [
                {
                  id: 1,
                  name: 'Sistema Dental',
                  urlSegment: 'sistema_dental',
                  modules: [
                    {
                      id: 1,
                      name: 'Dashboard',
                      url: '/sistema_dental/inicio',
                      icon: 'home',
                      order: 1
                    },
                    {
                      id: 2,
                      name: 'Pacientes',
                      url: null,
                      icon: 'users',
                      order: 2,
                      submenu: [
                        {
                          name: 'Lista de Pacientes',
                          url: '/sistema_dental/pacientes',
                          icon: 'list'
                        }
                      ]
                    },
                    {
                      id: 3,
                      name: 'Agenda',
                      url: '/sistema_dental/agenda',
                      icon: 'calendar',
                      order: 3
                    },
                    {
                      id: 4,
                      name: 'Tratamientos',
                      url: '/sistema_dental/tratamientos',
                      icon: 'medical',
                      order: 4
                    },
                    {
                      id: 5,
                      name: 'Facturación',
                      url: '/sistema_dental/facturacion',
                      icon: 'invoice',
                      order: 5
                    },
                    {
                      id: 6,
                      name: 'Inventario',
                      url: '/sistema_dental/inventario',
                      icon: 'inventory',
                      order: 6
                    },
                    {
                      id: 7,
                      name: 'Reportes',
                      url: '/sistema_dental/reportes',
                      icon: 'chart',
                      order: 7
                    },
                    {
                      id: 8,
                      name: 'Configuración',
                      url: '/sistema_dental/configuracion',
                      icon: 'settings',
                      order: 8
                    }
                  ]
                }
              ]
            };
            localStorage.setItem('UserData', JSON.stringify(mockUserData));
          }
        }
      })
    );

    // TODO: Descomentar cuando el endpoint esté disponible
    // const payload = this.genericPayloadService.createPayload(Modulos.MODULE_LOGIN, { ...login });
    // return this._http
    //   .post<LoginResponse>(`${environment.BASE_API_SISTEMA_CONTABLE}/auth/login`, { body: payload })
    //   .pipe(
    //     tap((response) => {
    //       if (response.status === 'OK') {
    //         const data = response.data;
    //         localStorage.setItem('UserData', JSON.stringify(data));
    //       }
    //     }),
    //   );
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

  getPermissions(): any[] {
    const userData = this.getUserData();
    return userData?.permission || [];
  }

  logout(): void {
    // Usar mock temporal - reemplazar con endpoint real cuando esté disponible
    AuthMock.logout().subscribe(() => {
      localStorage.removeItem('UserData');
      this.router.navigate(['/login']);
    });

    // TODO: Descomentar cuando el endpoint esté disponible
    // const payload = this.genericPayloadService.createPayload(Modulos.MODULE_LOGIN, '');
    // this._http.post(`${environment.BASE_API_SISTEMA_CONTABLE}/auth/logout`, { body: payload }).subscribe(
    //   (resp: any) => {
    //     if (resp.status === 'OK') {
    //       localStorage.removeItem('UserData');
    //       this.router.navigate(['/login']);
    //     }
    //   }
    // );
  }
}
