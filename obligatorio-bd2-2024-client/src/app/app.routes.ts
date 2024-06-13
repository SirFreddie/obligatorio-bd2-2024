import { Routes } from '@angular/router';
import { openAuthGuard } from './core/guards/open-auth.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    canActivate: [openAuthGuard],
    loadChildren: () =>
      import('./modules/home/home.routes').then(r => r.HOME_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
