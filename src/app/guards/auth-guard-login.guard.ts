import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services';

export const authGuardLoginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(UserService);

  // Verificar si el token de autenticación existe
  const token = authService.getAuthToken();
  if (token) {
    const permissions = authService.getPermissions();
    if (permissions && permissions.length > 0) {
      const url = permissions[0].urlSegment;
      router.navigate([`/${url}/inicio`]);
    } else {
      router.navigate(['/sistema_dental/inicio']);
    }
    return false;
  }

  // Si no hay token, permitir acceso al login
  return true;
};
