import { Route } from '@angular/router';
import { ProveedoresComponent } from './proveedores.component';
import { AggXmlComponent } from './components';

export default [
  {
    path: '',
    component: ProveedoresComponent,
  },

  {
    path: ':ideProveedorEncrypted',
    loadComponent: () =>
      import('../details-proveedor/details-proveedor.component').then((c) => c.DetailsProveedorComponent),
  },
  {
    path: 'importar-xml',
    component: AggXmlComponent,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
