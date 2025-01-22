import { Route } from '@angular/router';
import { EmisionComponent } from './emision.component';


export default [
  {
    path: '',
    component: EmisionComponent,
  },
  // {
  //   path: ':idePersonaRolEncrypted',
  //   loadComponent: () =>
  //     import('./../details-counter').then((module) => module.DetailsCounterComponent),
  // },
  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
