import { Route } from '@angular/router';
import { DocumentosComponent } from './documentos.component';


export default [
  {
    path: '',
    component: DocumentosComponent,
  },
  // {
  //   path: ':idePersonaRolEncrypted',
  //   loadComponent: () =>
  //     import('./../details-counter').then((module) => module.DetailsCounterComponent),
  // },
  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
