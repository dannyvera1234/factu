import { Route } from '@angular/router';
import { CountersComponent } from './counters.component';


export default [
  {
    path: '',
    component: CountersComponent,
  },
  // {
  //   path: 'create',
  //   loadComponent: () => import('../create-applications').then(m => m.CreateApplicationsComponent),
  // },
  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
