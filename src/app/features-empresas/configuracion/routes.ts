import { Route } from '@angular/router';
import { ConfiguracionComponent } from './configuracion.component';


export default [
  {
    path: '',
    component: ConfiguracionComponent,
  },
  // {
  //   path: ':idePersonaRolEncrypted',
  //   loadComponent: () =>
  //     import('./../details-counter').then((module) => module.DetailsCounterComponent),
  // },
  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
