import { Route } from '@angular/router';
import { DetailsXmlComponent } from './details-xml.component';


export default [
  {
    path: '',
    component: DetailsXmlComponent,
  },


  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
