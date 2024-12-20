import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '@/services';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);

  const token = userService.getAuthToken();

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(authReq);
};
