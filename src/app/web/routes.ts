import { Route } from '@angular/router';
import { PegaInformativeComponent } from './pega-informative';

export default [
  {
    path: '',
    component: PegaInformativeComponent,
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
