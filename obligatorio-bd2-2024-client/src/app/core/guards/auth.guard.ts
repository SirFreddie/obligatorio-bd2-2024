import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (
    authService.validateToken().pipe(
      tap(valid => {
        if (!valid) {
          router.navigateByUrl('/home');
        }
      })
    ) &&
    authService.isAdmin
  ) {
    return true;
  } else {
    router.navigateByUrl('/home');
    return false;
  }
};
