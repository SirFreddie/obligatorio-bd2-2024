import { CanActivateFn } from '@angular/router';

export const validateTokenGuard: CanActivateFn = (route, state) => {
  return true;
};
