import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomInputComponent } from '@/components';

@Component({
  selector: 'app-registro-proveedor',
  imports: [ReactiveFormsModule, CustomInputComponent],
  templateUrl: './registro-proveedor.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistroProveedorComponent implements OnInit {

  @Output() public readonly agregarRegistro = new EventEmitter<any | null>()

  proveedorForm!: FormGroup;
  constructor(private fb: FormBuilder) { }
  ngOnInit(): void {
    this.proveedorForm = this.fb.group({
      nombre: ['', Validators.required],
      ruc: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      tipoIdentificacion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      direccionEstablecimiento: ['', Validators.required],
      ciudad: ['', Validators.required],
      provincia: ['', Validators.required],
      codigoPostal: ['', Validators.required],
      formaPago: ['', Validators.required],
      condicionesPago: ['', Validators.required],
      cuentaBancaria: ['', Validators.required],
      moneda: ['', Validators.required],
      tipoContribuyente: ['', Validators.required],
      numeroRegistro: ['', Validators.required],
      autorizacionContabilidad: ['', Validators.required]
    });
  }
}
