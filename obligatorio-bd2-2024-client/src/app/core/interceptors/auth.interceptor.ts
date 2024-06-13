import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof localStorage === 'undefined') {
    return next(req);
  }

  const token = localStorage.getItem('token');

  if (!token) {
    return next(req);
  }

  const cloned = req.clone({
    headers: req.headers.set('Authorization', token),
  });

  return next(cloned);
};
