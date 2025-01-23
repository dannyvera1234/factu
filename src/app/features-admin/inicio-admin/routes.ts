import { Route } from '@angular/router';
import { InicioAdminComponent } from './inicio-admin.component';

export default [
  {
    path: '',
    component: InicioAdminComponent,
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
