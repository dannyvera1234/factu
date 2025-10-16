import { Observable } from 'rxjs';
import { LoginResponse } from '../../app/interfaces';

export class AuthMock {
  static login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    const mockResponse: LoginResponse = {
      code: 200,
      status: 'OK',
      message: 'Login exitoso',
      data: {
        token: 'mock-jwt-token-12345'
      }
    };

    // Datos adicionales para localStorage (simulando estructura completa)
    const mockUserData = {
      token: 'mock-jwt-token-12345',
      refresh_token: 'mock-refresh-token-67890',
      user: {
        id: 1,
        username: credentials.username,
        email: 'usuario@dental.com',
        name: 'Dr. Usuario Demo'
      },
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
              url: '/sistema_dental/pacientes',
              icon: 'users',
              order: 2,
              submenu: [
                { name: 'Lista de Pacientes', url: '/sistema_dental/pacientes', icon: 'list' },
                { name: 'Nuevo Paciente', url: '/sistema_dental/pacientes/nuevo', icon: 'plus' },
                { name: 'Historial Clínico', url: '/sistema_dental/pacientes/historial', icon: 'document' }
              ]
            },
            {
              id: 3,
              name: 'Agenda',
              url: '/sistema_dental/agenda',
              icon: 'calendar',
              order: 3,
              submenu: [
                { name: 'Calendario', url: '/sistema_dental/agenda/calendario', icon: 'calendar' },
                { name: 'Nueva Cita', url: '/sistema_dental/agenda/nueva', icon: 'plus' },
                { name: 'Recordatorios', url: '/sistema_dental/agenda/recordatorios', icon: 'bell' }
              ]
            },
            {
              id: 4,
              name: 'Tratamientos',
              url: '/sistema_dental/tratamientos',
              icon: 'medical',
              order: 4,
              submenu: [
                { name: 'Planes de Tratamiento', url: '/sistema_dental/tratamientos/planes', icon: 'clipboard' },
                { name: 'Odontograma', url: '/sistema_dental/tratamientos/odontograma', icon: 'tooth' },
                { name: 'Presupuestos', url: '/sistema_dental/tratamientos/presupuestos', icon: 'calculator' }
              ]
            },
            {
              id: 5,
              name: 'Facturación',
              url: '/sistema_dental/facturacion',
              icon: 'invoice',
              order: 5,
              submenu: [
                { name: 'Emitir Factura', url: '/sistema_dental/facturacion/emitir', icon: 'receipt' },
                { name: 'Control de Pagos', url: '/sistema_dental/facturacion/pagos', icon: 'credit-card' },
                { name: 'Planes de Pago', url: '/sistema_dental/facturacion/planes', icon: 'banknotes' }
              ]
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
              order: 7,
              submenu: [
                { name: 'Reportes Financieros', url: '/sistema_dental/reportes/financieros', icon: 'chart-bar' },
                { name: 'Estadísticas Clínicas', url: '/sistema_dental/reportes/clinicas', icon: 'chart-pie' },
                { name: 'Análisis de Productividad', url: '/sistema_dental/reportes/productividad', icon: 'trending-up' }
              ]
            },

          ]
        }
      ]
    };

    return new Observable<LoginResponse>(observer => {
      setTimeout(() => {
        if (credentials.username && credentials.password) {
          // Guardar datos completos en localStorage
          localStorage.setItem('UserData', JSON.stringify(mockUserData));
          observer.next(mockResponse);
        } else {
          observer.next({
            code: 400,
            status: 'ERROR',
            message: 'Credenciales inválidas',
            data: { token: '' }
          });
        }
        observer.complete();
      }, 1000);
    });
  }

  static logout(): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ status: 'OK', message: 'Logout exitoso' });
        observer.complete();
      }, 500);
    });
  }
}
