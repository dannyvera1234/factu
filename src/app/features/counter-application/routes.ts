import { Route } from '@angular/router';
import { CounterApplicationComponent } from './counter-application.component';

export default [
  {
    path: '',
    component: CounterApplicationComponent,
  },
  {
    path: 'create',
    loadComponent: () =>
      import('../create-counter-application/create-counter-application.component').then(
        (m) => m.CreateCounterApplicationComponent,
      ),
  },
  {
    path: ':idePersonaRolEncrypted',
    loadComponent: () =>
      import('../details-counter-application/details-counter-application.component').then(
        (m) => m.DetailsCounterApplicationComponent,
      ),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
