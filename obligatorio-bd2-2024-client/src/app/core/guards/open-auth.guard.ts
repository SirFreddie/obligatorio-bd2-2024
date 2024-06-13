import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const openAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  authService.validateToken().subscribe();
  return true;
};
