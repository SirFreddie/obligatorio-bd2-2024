import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/home/home.routes').then(m => m.HOME_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./pages/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
