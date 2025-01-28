import { Route } from '@angular/router';
import { ProveedoresComponent } from './proveedores.component';
import { DetailsXmlComponent } from './components';


export default [
  {
    path: '',
    component: ProveedoresComponent,
    // children: [
    //   {
    //     path: 'detalle_proveedor',
    //     // component: DetailsXmlComponent,
    //     loadChildren: () => import('./components/details-xml/routes'),
    //   }
    // ]
  },



  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
