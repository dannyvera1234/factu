import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authService = inject(UserService);
  if (authService.getAuthToken()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
