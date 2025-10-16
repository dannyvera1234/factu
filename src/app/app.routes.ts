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
    loadComponent: () => import('./web/sobre-nosotros/sobre-nosotros.component').then((m) => m.SobreNosotrosComponent),
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
    path: 'sistema_dental',
    canActivate: [authGuard],
    loadComponent() {
      return import('./layout/layout.component').then((m) => m.LayoutComponent);
    },
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./features-dental/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'pacientes',
        loadChildren: () => import('./features-dental/pacientes/routes'),
      },
      {
        path: 'agenda',
        loadComponent: () => import('./features-dental/agenda/agenda.component').then(m => m.AgendaComponent),
      },
      {
        path: 'tratamientos',
        loadComponent: () => import('./features-dental/tratamientos/tratamientos.component').then(m => m.TratamientosComponent),
      },
      {
        path: 'facturacion',
        loadComponent: () => import('./features-dental/facturacion/facturacion.component').then(m => m.FacturacionComponent),
      },
      {
        path: 'inventario',
        loadComponent: () => import('./features-dental/inventario/inventario.component').then(m => m.InventarioComponent),
      },
      {
        path: 'reportes',
        loadComponent: () => import('./features-dental/reportes/reportes.component').then(m => m.ReportesComponent),
      },
      // {
      //   path: 'configuracion',
      //   loadChildren: () => import('./features-empresas/configuracion/routes'),
      // },
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

];
