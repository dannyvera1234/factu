import { Route } from '@angular/router';
import { ClientesComponent } from './clientes.component';


export default [
  {
    path: '',
    component: ClientesComponent,
  },
  // {
  //   path: ':idePersonaRolEncrypted',
  //   loadComponent: () =>
  //     import('./../details-counter').then((module) => module.DetailsCounterComponent),
  // },
  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
