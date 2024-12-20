import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { CustomInputComponent } from '@/components';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { emailValidator } from '@/utils/validators';
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
    ruc: [{ value: '', disabled: true }],
    address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    code: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email: ['', [Validators.required, emailValidator()]],
    cellPhone: [
      '09',
      [Validators.required, Validators.minLength(10), Validators.maxLength(10)],
    ],
  });

  onUsernameInput(event: any, sourceField: string): void {
    const inputValue = event.target.value;

    const newValue = inputValue.replace(/[^0-9]/g, '');

    event.target.value = newValue;

    const control = this.form.get(sourceField);

    if (control) {
      control.setValue(newValue);
    }
  }

  public submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const newEstablishment = {
      address: this.form.controls.address.value,
      code: this.form.controls.code.value,
      email: this.form.controls.email.value,
      cellPhone: this.form.controls.cellPhone.value,
      idSender: 2,
    } as CreateEstablecimiento;

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.serviceEstablecimiento.createEstablecimiento(newEstablishment)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe(() => {
        this.establecimientoCreate.emit(), this.form.reset();
        this.form.setValue({
          ruc: '',
          address: '',
          code: '',
          email: '',
          cellPhone: '09',
        });
      });
  }
}
