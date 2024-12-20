import { Route } from '@angular/router';
import { PerfilesComponent } from './perfiles.component';

export default [
  {
    path: '',
    component: PerfilesComponent,
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
