import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { authGuardLoginGuard } from './guards/auth-guard-login.guard';

export const routes: Routes & {
  data?: any & { icon?: string; name?: string; permissions?: string };
} = [
  { path: '', redirectTo: '', pathMatch: 'full' },

  {
    path: '',
    loadComponent: () =>
      import('./web/pega-informative/pega-informative.component').then((m) => m.PegaInformativeComponent),
  },
  {
    path: 'registro_contadores',
    loadComponent: () =>
      import('./web/registro-contadores/registro-contadores.component').then((m) => m.RegistroContadoresComponent),
  },
  {
    path: 'login',
    loadChildren: () => import('./features/login/routes'),
    canActivate: [authGuardLoginGuard],
  },

  {
    path: 'sistema_contable',
    canActivate: [authGuard],
    loadComponent() {
      return import('./layout/layout.component').then((m) => m.LayoutComponent);
    },

    children: [
      {
        path: 'inicio_contadores',
        loadChildren: () => import('./features/home/routes'),
      },
      {
        path: 'aplicaciones_contadores',
        loadChildren: () => import('./features/counter-application/routes'),
      },
      {
        path: 'inventory',
        loadChildren: () => import('./features/inventario/routes'),
      },
      {
        path: 'planes',
        loadChildren: () => import('./features/planes/routes'),
      },
      {
        path: 'perfiles',
        loadChildren: () => import('./features/perfiles/routes'),
      },
      {
        path: 'perfilescontadores',
        loadChildren: () => import('./features/counters/routes'),
      },
      {
        path: 'emision_contadores',
        loadChildren: () => import('./features/emision/routes'),
      },
      {
        path: 'establishment',
        loadChildren: () => import('./features/configuration/establecimientos/routes'),
      },
      {
        path: '**',
        redirectTo: 'inicio_contadores',
        pathMatch: 'full',
      },
    ],
  },
];
