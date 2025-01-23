import { Route } from '@angular/router';
import { PerfilUsuariosComponent } from './perfil-usuarios.component';

export default [
  {
    path: '',
    component: PerfilUsuariosComponent,
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
