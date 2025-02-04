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
    path: 'sobre_nosotros',
    loadComponent: () =>
      import('./web/sobre-nosotros/sobre-nosotros.component').then((m) => m.SobreNosotrosComponent),
  },
  {
    path: 'registro_empresa',
    loadComponent: () =>
      import('./web/registro-empresa/registro-empresa.component').then((m) => m.RegistroEmpresaComponent),
  },
  {
    path: 'login',
    loadChildren: () => import('./components/login/routes'),
    canActivate: [authGuardLoginGuard],
  },

  // cuenta para empresa
  {
    path: 'sistema_contable_empresa',
    canActivate: [authGuard],
    loadComponent() {
      return import('./layout/layout.component').then((m) => m.LayoutComponent);
    },
    children: [
      {
        path: 'inicio',
        loadChildren: () => import('./features-empresas/home/routes'),
      },
      {
        path: 'configuracion',
        loadChildren: () => import('./features-empresas/configuracion/routes'),
      },
      {
        path: 'emision_empresas',
        loadChildren: () => import('./features-empresas/emision/routes'),
      },


      {
        path: '**',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },
    ],
  },
  // cuenta para administrador
  {
    path: 'sistema_contable_admin',
    canActivate: [authGuard],
    loadComponent() {
      return import('./layout/layout.component').then((m) => m.LayoutComponent);
    },
    children: [
      {
        path: 'inicio',
        loadChildren: () => import('./features-admin/inicio-admin/routes'),
      },
      {
        path: 'aplicaciones_emisores',
        loadChildren: () => import('./features-admin/perfil-empresa/routes'),
      },
      {
        path: 'perfilescontadores',
        loadChildren: () => import('./features-admin/perfil-contador/routes'),
      },
      {
        path: 'perfiles',
        loadChildren: () => import('./features-admin/perfil-usuarios/routes'),
      },

      {
        path: '**',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },
    ],
  },
  //cuenta de contador
  {
    path: 'sistema_contable_contador',
    canActivate: [authGuard],
    loadComponent() {
      return import('./layout/layout.component').then((m) => m.LayoutComponent);
    },

    children: [
      {
        path: 'inicio',
        loadChildren: () => import('./feature-counters/home/routes'),
      },
      {
        path: 'aplicaciones_contadores',
        loadChildren: () => import('./feature-counters/counter-application/routes'),
      },
      {
        path: 'emision_contadores',
        loadChildren: () => import('./feature-counters/emision/routes'),
      },

      // {
      //   path: 'planes',
      //   loadChildren: () => import('./features/planes/routes'),
      // },
      // {
      //   path: 'perfiles',
      //   loadChildren: () => import('./features/perfiles/routes'),
      // },
      // {
      //   path: 'perfilescontadores',
      //   loadChildren: () => import('./features/counters/routes'),
      // },

      // {
      //   path: 'establishment',
      //   loadChildren: () => import('./features/configuration/establecimientos/routes'),
      // },
      {
        path: '**',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },
    ],
  },
];
