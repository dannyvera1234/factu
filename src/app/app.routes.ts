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
    path: 'sistema_contable',
    canActivate: [authGuard],
    loadComponent() {
      return import('./layout/layout.component').then((m) => m.LayoutComponent);
    },
    children: [
      {
        path: 'aplicaciones_contadores',
        loadChildren: () => import('./features/counter-application/routes'),

      },
      {
        path: 'inventory',
        loadChildren: () => import('./features/inventario/routes'),
        data: {
          icon: '/assets/icon/inventory.svg',
          name: 'Inventario',
          permissions: 'INVENTARIO'
        },
      },
      {
        path: 'planes',
        loadChildren: () => import('./features/planes/routes'),
        data: {
          icon: '/assets/icon/plan.svg',
          name: 'Planes',
          permissions: 'PLANES'
        },
      },
      {
        path: 'perfiles',
        loadChildren: () => import('./features/perfiles/routes'),
        data: {
          icon: '/assets/icon/perfiles.svg',
          permissions: 'REGISTRO_USUARIOS'
        },
      },
      {
        path: 'perfilescontadores',
        loadChildren: () => import('./features/counters/routes'),
        data: {
          icon: '/assets/icon/perfiles.svg',
          permissions: 'PERFILES_CONTADORES'
        },
      },
      {
        path: 'establishment',
        loadChildren: () => import('./features/configuration/establecimientos/routes'),
        data: {
          permissions: 'ESTABLECIMIENTOS'
        },
      },
      {
        path: '**',
        redirectTo: 'applications',
        pathMatch: 'full',
      },
    ],
  },
];
