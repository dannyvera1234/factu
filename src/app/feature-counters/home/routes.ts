import { Route } from '@angular/router';
import { HomeComponent } from './home.component';

export default [
  {
    path: '',
    component: HomeComponent,
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
