import { Route } from '@angular/router';
import { ConfiguracionComponent } from './configuracion.component';


export default [
  {
    path: '',
    component: ConfiguracionComponent,
  },


  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
