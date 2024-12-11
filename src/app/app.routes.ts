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
        path: 'establishment',
        loadChildren: () => import('./features/configuration/establecimientos/routes'),
      },
      {
        path: '**',
        redirectTo: 'applications',
        pathMatch: 'full',
      },
    ]
  }

]
