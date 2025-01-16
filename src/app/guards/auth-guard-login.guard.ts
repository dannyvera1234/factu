import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services';

export const authGuardLoginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(UserService);

  // Verificar si el token de autenticación existe
  const token = authService.getAuthToken();
  if (token) {
    // Si el token existe, redirigir al dashboard (o alguna página que desees)
    console.log('Usuario ya autenticado. Redirigiendo al dashboard...');
    router.navigate(['/sistema_contable']);
    return false;
  }

  // Si no hay token, permitir acceso al login
  return true;
};
