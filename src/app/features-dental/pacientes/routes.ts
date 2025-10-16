import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./components/lista-pacientes/lista-pacientes.component').then(m => m.ListaPacientesComponent),
  },
  {
    path: 'nuevo',
    loadComponent: () => import('./components/nuevo-paciente/nuevo-paciente.component').then(m => m.NuevoPacienteComponent),
  },
  {
    path: 'historial',
    loadComponent: () => import('./components/historial-clinico/historial-clinico.component').then(m => m.HistorialClinicoComponent),
  }
] as Routes;
