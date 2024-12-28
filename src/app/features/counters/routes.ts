import { Route } from '@angular/router';
import { CountersComponent } from './counters.component';


export default [
  {
    path: '',
    component: CountersComponent,
  },
  {
    path: ':idePersonaRolEncrypted',
    loadComponent: () =>
      import('./../details-counter').then((module) => module.DetailsCounterComponent),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
