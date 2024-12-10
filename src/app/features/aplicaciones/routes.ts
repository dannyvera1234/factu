import { Route } from '@angular/router';
import { AplicacionesComponent } from '.';


export default [
  {
    path: '',
    component: AplicacionesComponent,
  },
  {
    path: 'create',
    loadComponent: () => import('../create-applications').then(m => m.CreateApplicationsComponent),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
