import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { NuevoPacienteComponent } from '../nuevo-paciente/nuevo-paciente.component';

@Component({
  selector: 'app-lista-pacientes',
  imports: [CommonModule, FormsModule, BreadcrumbComponent, NuevoPacienteComponent],
  templateUrl: './lista-pacientes.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaPacientesComponent {
  searchTerm = signal('');
  selectedStatus = signal('todos');
  viewMode = signal<'table' | 'cards'>('table');
  currentPage = signal(1);
  itemsPerPage = 10;
  showSearchDropdown = signal(false);
  showNewPatientModal = signal(false);

  constructor(private router: Router) {}



  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Dashboard', route: '/sistema_dental/inicio' },
    { label: 'Pacientes', route: '/pacientes' },
    { label: 'Lista de Pacientes' }
  ];

  // Datos simulados de pacientes
  allPatients = signal([
    {
      id: 1,
      name: 'María García López',
      phone: '+34 612 345 678',
      email: 'maria.garcia@email.com',
      age: 32,
      lastVisit: '2024-01-15',
      nextAppointment: '2024-01-25',
      status: 'activo',
      treatments: ['Limpieza', 'Ortodoncia'],
      avatar: 'MG'
    },
    {
      id: 2,
      name: 'Juan Pérez Martín',
      phone: '+34 623 456 789',
      email: 'juan.perez@email.com',
      age: 45,
      lastVisit: '2024-01-10',
      nextAppointment: null,
      status: 'activo',
      treatments: ['Implante'],
      avatar: 'JP'
    },
    {
      id: 3,
      name: 'Ana López Ruiz',
      phone: '+34 634 567 890',
      email: 'ana.lopez@email.com',
      age: 28,
      lastVisit: '2023-12-20',
      nextAppointment: '2024-01-30',
      status: 'inactivo',
      treatments: ['Endodoncia'],
      avatar: 'AL'
    },
    {
      id: 4,
      name: 'Carlos Ruiz Sánchez',
      phone: '+34 645 678 901',
      email: 'carlos.ruiz@email.com',
      age: 38,
      lastVisit: '2024-01-12',
      nextAppointment: '2024-01-28',
      status: 'deudor',
      treatments: ['Limpieza', 'Blanqueamiento'],
      avatar: 'CR'
    },
    {
      id: 5,
      name: 'Lucía Martín Torres',
      phone: '+34 656 789 012',
      email: 'lucia.martin@email.com',
      age: 25,
      lastVisit: '2024-01-18',
      nextAppointment: '2024-02-05',
      status: 'activo',
      treatments: ['Ortodoncia'],
      avatar: 'LM'
    },
    {
      id: 6,
      name: 'Pedro Fernández Gil',
      phone: '+34 667 890 123',
      email: 'pedro.fernandez@email.com',
      age: 52,
      lastVisit: '2024-01-08',
      nextAppointment: '2024-02-10',
      status: 'activo',
      treatments: ['Prótesis'],
      avatar: 'PF'
    },
    {
      id: 7,
      name: 'Carmen Jiménez Vega',
      phone: '+34 678 901 234',
      email: 'carmen.jimenez@email.com',
      age: 41,
      lastVisit: '2023-11-15',
      nextAppointment: null,
      status: 'inactivo',
      treatments: ['Limpieza'],
      avatar: 'CJ'
    },
    {
      id: 8,
      name: 'Roberto Silva Moreno',
      phone: '+34 689 012 345',
      email: 'roberto.silva@email.com',
      age: 35,
      lastVisit: '2024-01-20',
      nextAppointment: '2024-02-15',
      status: 'deudor',
      treatments: ['Endodoncia', 'Corona'],
      avatar: 'RS'
    },
    {
      id: 9,
      name: 'Elena Rodríguez Castro',
      phone: '+34 690 123 456',
      email: 'elena.rodriguez@email.com',
      age: 29,
      lastVisit: '2024-01-22',
      nextAppointment: '2024-02-08',
      status: 'activo',
      treatments: ['Blanqueamiento'],
      avatar: 'ER'
    },
    {
      id: 10,
      name: 'Francisco Herrera Díaz',
      phone: '+34 601 234 567',
      email: 'francisco.herrera@email.com',
      age: 48,
      lastVisit: '2024-01-05',
      nextAppointment: '2024-01-29',
      status: 'activo',
      treatments: ['Implante', 'Limpieza'],
      avatar: 'FH'
    },
    {
      id: 11,
      name: 'Isabel Morales Ruiz',
      phone: '+34 612 345 678',
      email: 'isabel.morales@email.com',
      age: 33,
      lastVisit: '2023-12-10',
      nextAppointment: null,
      status: 'inactivo',
      treatments: ['Ortodoncia'],
      avatar: 'IM'
    },
    {
      id: 12,
      name: 'Miguel Ángel Vargas',
      phone: '+34 623 456 789',
      email: 'miguel.vargas@email.com',
      age: 44,
      lastVisit: '2024-01-16',
      nextAppointment: '2024-02-12',
      status: 'deudor',
      treatments: ['Prótesis', 'Extracción'],
      avatar: 'MV'
    },
    {
      id: 13,
      name: 'Sofía Delgado Peña',
      phone: '+34 634 567 890',
      email: 'sofia.delgado@email.com',
      age: 26,
      lastVisit: '2024-01-19',
      nextAppointment: '2024-02-06',
      status: 'activo',
      treatments: ['Limpieza', 'Fluorización'],
      avatar: 'SD'
    },
    {
      id: 14,
      name: 'Antonio Guerrero López',
      phone: '+34 645 678 901',
      email: 'antonio.guerrero@email.com',
      age: 39,
      lastVisit: '2024-01-11',
      nextAppointment: '2024-02-01',
      status: 'activo',
      treatments: ['Endodoncia'],
      avatar: 'AG'
    },
    {
      id: 15,
      name: 'Beatriz Romero Sanz',
      phone: '+34 656 789 012',
      email: 'beatriz.romero@email.com',
      age: 31,
      lastVisit: '2023-10-25',
      nextAppointment: null,
      status: 'inactivo',
      treatments: ['Blanqueamiento'],
      avatar: 'BR'
    }
  ]);

  // Pacientes filtrados
  filteredPatients = computed(() => {
    let patients = this.allPatients();

    // Filtrar por término de búsqueda
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      patients = patients.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.phone.includes(term) ||
        p.email.toLowerCase().includes(term)
      );
    }

    // Filtrar por estado
    if (this.selectedStatus() !== 'todos') {
      patients = patients.filter(p => p.status === this.selectedStatus());
    }

    return patients;
  });

  // Pacientes paginados
  paginatedPatients = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredPatients().slice(start, end);
  });

  // Total de páginas
  totalPages = computed(() => {
    return Math.ceil(this.filteredPatients().length / this.itemsPerPage);
  });

  // Estadísticas
  stats = computed(() => {
    const all = this.allPatients();
    return {
      total: all.length,
      active: all.filter(p => p.status === 'activo').length,
      inactive: all.filter(p => p.status === 'inactivo').length,
      debtors: all.filter(p => p.status === 'deudor').length
    };
  });

  newPatient() {
    this.showSearchDropdown.set(false);
    this.showNewPatientModal.set(true);
  }

  closeModal() {
    this.showNewPatientModal.set(false);
  }

  onPatientSaved() {
    this.showNewPatientModal.set(false);
    // Aquí podrías recargar la lista de pacientes
  }

  hideSearchDropdown() {
    setTimeout(() => this.showSearchDropdown.set(false), 150);
  }

  viewProfile(patientId: number) {
    console.log('Ver perfil:', patientId);
  }

  newAppointment(patientId: number) {
    console.log('Nueva cita para:', patientId);
  }

  editPatient(patientId: number) {
    console.log('Editar paciente:', patientId);
  }

  exportList() {
    const data = this.filteredPatients().map(p => ({
      Nombre: p.name,
      Teléfono: p.phone,
      Email: p.email,
      Edad: p.age,
      'Última Visita': p.lastVisit,
      'Próxima Cita': p.nextAppointment || 'Sin cita',
      Estado: this.getStatusText(p.status),
      Tratamientos: p.treatments.join(', ')
    }));

    const csv = this.convertToCSV(data);
    this.downloadCSV(csv, 'pacientes.csv');
  }

  importList(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result as string;
        this.parseCSV(csv);
      };
      reader.readAsText(file);
    }
  }

  private convertToCSV(data: any[]): string {
    if (!data.length) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).map(val => `"${val}"`).join(','));
    return [headers, ...rows].join('\n');
  }

  private downloadCSV(csv: string, filename: string) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private parseCSV(csv: string) {
    console.log('Importando pacientes desde CSV:', csv);
    // Aquí implementarías la lógica para parsear el CSV y agregar pacientes
  }

  goToPage(page: number) {
    this.currentPage.set(page);
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'inactivo': return 'bg-gray-100 text-gray-800';
      case 'deudor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string) {
    switch (status) {
      case 'activo': return 'Activo';
      case 'inactivo': return 'Inactivo';
      case 'deudor': return 'Deudor';
      default: return status;
    }
  }



  Math = Math;
}
