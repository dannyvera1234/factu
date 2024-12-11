import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { CustomInputComponent } from '@/components';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { onlyNumbersValidator } from '@/utils/validators';
import { finalize, mergeMap, of } from 'rxjs';
import { EstablecimientoService } from '@/services';
import { CreateEstablecimiento } from '@/interfaces/establecimiento';

@Component({
  selector: 'app-create-establecimientos',
  imports: [CustomInputComponent, ReactiveFormsModule],
  templateUrl: './create-establecimientos.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEstablecimientosComponent {
  public readonly loading = signal(false);

  public readonly logoPreview = signal<string | null>(null);

  public readonly establecimientoCreate = output<void>();

  constructor(
    private _fb: FormBuilder,
    private readonly serviceEstablecimiento: EstablecimientoService,
  ) {}

  public readonly form = this._fb.group({
    establecimiento: [
      '001',
      [Validators.required, Validators.minLength(3), Validators.maxLength(50), onlyNumbersValidator()],
    ],
    direccion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    telefono: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), onlyNumbersValidator()]],
    nombre_empresa: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    ruc: [{ value: '', disabled: true }],
    logo: [''],
  });

  public submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const newEstablishment = {
      establecimiento: this.form.controls.establecimiento.value?.trim(),
      direccion: this.form.controls.direccion.value?.trim(),
      telefono: Number(this.form.controls.telefono.value),
      nombre_empresa: this.form.controls.nombre_empresa.value?.trim(),
      ruc: Number(this.form.controls.ruc.value),
      logo: this.form.controls.logo.value,
    } as CreateEstablecimiento;

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.serviceEstablecimiento.createEstablecimiento(newEstablishment)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe(() => {
        this.establecimientoCreate.emit(), this.form.reset();
        this.form.setValue({
          establecimiento: '001',
          direccion: '',
          telefono: '',
          nombre_empresa: '',
          ruc: '',
          logo: '',
        });
      });
  }
}
