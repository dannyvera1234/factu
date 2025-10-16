import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  // Métricas principales
  todayPatients = signal(12);
  pendingAppointments = signal(8);
  todayRevenue = signal(2450);
  availableRooms = signal(3);

  // Próximas citas
  upcomingAppointments = signal([
    { time: '14:30', patient: 'María García', treatment: 'Limpieza dental', room: 'Sala 1' },
    { time: '15:00', patient: 'Juan Pérez', treatment: 'Extracción', room: 'Sala 2' },
    { time: '15:30', patient: 'Ana López', treatment: 'Ortodoncia', room: 'Sala 1' }
  ]);

  // Pacientes en espera
  waitingPatients = signal([
    { name: 'Carlos Ruiz', appointment: '14:00', status: 'Esperando' },
    { name: 'Lucía Martín', appointment: '14:15', status: 'En consulta' }
  ]);



  // Datos del gráfico (simulados)
  weeklyData = signal([
    { day: 'Lun', appointments: 15 },
    { day: 'Mar', appointments: 12 },
    { day: 'Mié', appointments: 18 },
    { day: 'Jue', appointments: 14 },
    { day: 'Vie', appointments: 20 },
    { day: 'Sáb', appointments: 8 },
    { day: 'Dom', appointments: 3 }
  ]);


}