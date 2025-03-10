import { Route } from '@angular/router';
import { InventarioComponent } from './inventario.component';

export default [
  {
    path: '',
    component: InventarioComponent
  },

  // {
  //   path: ':ideProveedorEncrypted',
  //   loadComponent: () =>
  //     import('../details-proveedor/details-proveedor.component').then((c) => c.DetailsProveedorComponent),
  // },

  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
