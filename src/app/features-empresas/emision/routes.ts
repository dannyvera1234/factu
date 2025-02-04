import { Route } from '@angular/router';
import { EmisionComponent } from './emision.component';

export default [
  {
    path: '',
    component: EmisionComponent,
  },
  {
    path: ':ideEncrypted',
    component: EmisionComponent,
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
