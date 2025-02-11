import { Route } from '@angular/router';
import { ClientesComponent } from './clientes.component';
import { DetailsClienteComponent } from '../details-cliente';

export default [
  {
    path: '',
    component: ClientesComponent,
  },
   {
     path: ':ideCustomerEncrypted',
     component: DetailsClienteComponent,
   },

  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
