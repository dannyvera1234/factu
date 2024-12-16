import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes & {
  data?: any & { icon?: string; name?: string; permissions?: string };
} = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadChildren: () => import('./features/login/routes'),
  },

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent() {
      return import('./layout/layout.component').then((m) => m.LayoutComponent);
    },
    children: [
      {
        path: 'applications',
        loadChildren: () => import('./features/aplicaciones/routes'),
        data: {
          icon: '/assets/icon/menu_applications.svg',
          name: 'Aplicaciones',
        },
      },
      {
        path: 'establishment',
        loadChildren: () => import('./features/configuration/establecimientos/routes'),
      },
      {
        path: '**',
        redirectTo: 'applications',
        pathMatch: 'full',
      },
    ],
  },
];
