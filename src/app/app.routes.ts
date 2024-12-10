import { Routes } from '@angular/router';

export const routes: Routes & {
  data?: any & { icon?: string; name?: string; permissions?: string };
} = [
  {
    path: '',

    children: [
      {
        path: 'Applications',
        loadChildren: () => import('./features/aplicaciones/routes'),

        data: {
          icon: '/assets/icons/menu_applications.svg',
          name: 'Aplicaciones',

        },
      },
      {
        path: '**',
        redirectTo: 'applications',
        pathMatch: 'full',
      },
    ]
  }

]
