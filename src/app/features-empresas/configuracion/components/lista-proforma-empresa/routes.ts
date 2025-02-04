import { Route } from '@angular/router';
import { EmisionComponent } from '../../../emision';

export default [


   {
    path: 'sistema_contable_empresa/emision_empresas/:id',
    component:EmisionComponent

  },



  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
