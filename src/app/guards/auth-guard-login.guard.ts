import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services';

export const authGuardLoginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(UserService);

  // Verificar si el token de autenticación existe
  const token = authService.getAuthToken();
  if (token) {
    const url = authService.getPermissions()[0].urlSegment;
    router.navigate([ `/${url}/inicio`,]);
    return false;
  }

  // Si no hay token, permitir acceso al login
  return true;
};
