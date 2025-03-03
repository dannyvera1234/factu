import { Route } from '@angular/router';
import { DocumentsComponent } from './documents.component';

export default [
  {
    path: '',
    component: DocumentsComponent
  },



  { path: '**', redirectTo: '', pathMatch: 'full' },
] satisfies Route[];
