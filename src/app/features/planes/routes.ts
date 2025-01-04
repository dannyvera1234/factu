import { Route } from '@angular/router';
import { PlanesComponent } from './planes.component';


export default [
  {
    path: '',
    component: PlanesComponent,
  },
  // {
  //   path: 'create',
  //   loadComponent: () => import('../create-applications').then(m => m.CreateApplicationsComponent),
  // },
  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
