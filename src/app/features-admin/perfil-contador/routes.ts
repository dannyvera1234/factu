import { Route } from '@angular/router';
import { PerfilContadorComponent } from './perfil-contador.component';

export default [
  {
    path: '',
    component: PerfilContadorComponent,
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
