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

  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
