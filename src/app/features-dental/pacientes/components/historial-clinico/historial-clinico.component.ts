import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-historial-clinico',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbComponent],
  templateUrl: './historial-clinico.component.html'
})
export class HistorialClinicoComponent {
  constructor(private router: Router) {}

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Dashboard', route: '/sistema_dental/inicio' },
    { label: 'Pacientes', route: '/sistema_dental/pacientes' },
    { label: 'Historial Clínico' }
  ];

  historial = signal({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    treatment: '',
    observations: '',
    nextAppointment: '',
    medications: '',
    allergies: ''
  });

  onSubmit() {
    console.log('Guardando historial:', this.historial());
    this.router.navigate(['/sistema_dental/pacientes']);
  }

  cancel() {
    this.router.navigate(['/sistema_dental/pacientes']);
  }
}
