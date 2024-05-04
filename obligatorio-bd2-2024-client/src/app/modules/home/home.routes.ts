import { Routes } from '@angular/router';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./home.component'),
    children: [
      {
        path: 'fixture',
        loadComponent: () => import('./pages/fixture/fixture.component'),
      },
      {
        path: 'leaderboard',
        loadComponent: () =>
          import('./pages/leaderboard/leaderboard.component'),
      },
      { path: '**', redirectTo: 'fixture', pathMatch: 'full' },
    ],
  },
];
