import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin.component'),
    children: [
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component'),
      },
      {
        path: 'insights',
        title: 'Insights',
        loadComponent: () =>
          import('./pages/insights/insights.component').then(
            m => m.InsightsComponent
          ),
      },
      {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
