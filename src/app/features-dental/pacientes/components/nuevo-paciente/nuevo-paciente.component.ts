import { Component, signal, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule ],
  templateUrl: './nuevo-paciente.component.html'
})
export class NuevoPacienteComponent {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();

  constructor(private router: Router) {}

  // Formulario
  patient = signal({
    // Datos del Paciente
    document: '',
    documentType: 'cedula',
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: 'hombre',
    status: 'activo',
    phone: '',
    email: '',

    // Control de apoderado
    showGuardian: false,

    // Datos del Apoderado
    guardianDocument: '',
    guardianDocumentType: 'cedula',
    guardianEmail: '',
    guardianFirstName: '',
    guardianLastName: '',
    guardianAddress: '',
    guardianPhone: '',
    guardianRelation: 'mama',
    insurance: ''
  });

  onSubmit() {
    console.log('Guardando paciente:', this.patient());
    // Aquí implementarías la lógica para guardar


  }

  cancel() {
      this.onCancel.emit();

  }
}
