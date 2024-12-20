import { Route } from '@angular/router';
import { InventarioComponent } from './inventario.component';


export default [
  {
    path: '',
    component: InventarioComponent,
  },
  // {
  //   path: 'create',
  //   loadComponent: () => import('../create-applications').then(m => m.CreateApplicationsComponent),
  // },
  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
