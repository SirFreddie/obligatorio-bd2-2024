import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth.component'),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component'),
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/register/register.component'),
      },
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];
