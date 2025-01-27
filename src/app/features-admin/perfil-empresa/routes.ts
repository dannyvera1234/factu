import { Route } from '@angular/router';
import { PerfilEmpresaComponent } from './perfil-empresa.component';

export default [
  {
    path: '',
    component: PerfilEmpresaComponent,
  },
  {
     path:'create',
     loadComponent: () => import('@/features-admin/create-counter-application').then((m) => m.CreateCounterApplicationComponent),
   },
   {
    path: ':idePersonaRolEncrypted',
    loadComponent: () =>
      import('../details-empresa/details-empresa.component').then(
        (m) => m.DetailsEmpresaComponent,
      ),
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
