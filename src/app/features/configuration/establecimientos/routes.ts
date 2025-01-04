import { Route } from '@angular/router';
import { EstablecimientosComponent } from './establecimientos.component';


export default [
  {
    path: '',
    component: EstablecimientosComponent,
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
