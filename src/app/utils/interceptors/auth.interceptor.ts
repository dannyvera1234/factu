import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '@/services';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { NotificationService } from '../services';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const notification = inject(NotificationService);



  // Obtener el token de autorización desde el servicio
  const token = userService.getAuthToken();

  // Clonar la solicitud para agregar el token de autenticación si está disponible
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((resp) => {
      console.error('Error:', resp);
      notification.push({
        message: resp.error.message,
        type: 'error',
      })
      // Si recibimos un error 401 o 403, redirigimos a la página de inicio
      var error = resp.error;
      if (error.code === 401 || error.code === 403) {
        // Eliminar el token del almacenamiento local
        localStorage.removeItem('UserData');
        // Redirigir al usuario a la página de inicio
        router.navigate(['/login']); // Ajusta la ruta según lo necesites

        // Si quieres mostrar la notificación, puedes descomentar la siguiente línea
        let message =
          error.code === 401 ? 'Credenciales inválidas' : 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.';
        notification.push({
          message: message,
          type: 'error',
        });
        return of(); // Esto evita que el error se vuelva a lanzar.
      }

      // Re-lanzar el error para que otros manejadores de error lo procesen si no es 401 o 403
      return of(error);
    }),
  );
};
