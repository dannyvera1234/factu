import { Route } from '@angular/router';
import { EstablecimientoComponent } from './establecimiento.component';


export default [
  {
    path: '',
    component: EstablecimientoComponent,
  },

  {
    path: ':ideEstablecimientoEncrypted',
    loadComponent: () =>
      import('../details-establecimiento/details-establecimiento.component').then((c) => c.DetailsEstablecimientoComponent),
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
