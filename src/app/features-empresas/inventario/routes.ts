import { Route } from '@angular/router';
import { InventarioComponent } from './inventario.component';


export default [
  {
    path: '',
    component: InventarioComponent,
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
