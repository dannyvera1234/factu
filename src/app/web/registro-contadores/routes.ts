import { Route } from '@angular/router';
import { RegistroContadoresComponent } from './registro-contadores.component';

export default [
  {
    path: '',
    component: RegistroContadoresComponent,
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
