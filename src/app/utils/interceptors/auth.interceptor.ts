import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '@/services';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);

  const token = userService.getAuthToken();

  const authReg = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReg);
};
