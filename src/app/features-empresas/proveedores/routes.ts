import { Route } from '@angular/router';
import { ProveedoresComponent } from './proveedores.component';
import { AggXmlComponent, DetailsXmlComponent } from './components';

export default [
  {
    path: '',
    component: ProveedoresComponent,
  },

  {
    path: 'importar-xml',
    component: AggXmlComponent,
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
