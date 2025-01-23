import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { of, mergeMap, finalize } from 'rxjs';
import { NotificationService } from '@/utils/services';
import { emailValidator } from '@/utils/validators';
import { CustomInputComponent } from '@/components';
import { NgClass } from '@angular/common';
import { EmpresaService } from '@/services/service-empresas';

@Component({
  selector: 'app-create-establecimiento',
  imports: [CustomInputComponent, NgClass, ReactiveFormsModule],
  templateUrl: './create-establecimiento.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEstablecimientoComponent {
  @Input({ required: true }) set ruc(value: string) {
    this.form.patchValue({
      ruc: value,
    });
  }

  public readonly personaRolIde = signal<number | null>(null);

  public readonly loading = signal(false);

  public readonly logoPreview = signal<string | null>(null);

  @Output() public readonly createEstablecimiento = new EventEmitter<any | null>();

  constructor(
    private _fb: FormBuilder,
    private readonly notification: NotificationService,
    private readonly emisorService: EmpresaService,
  ) {}

  public readonly form = this._fb.group({
    ruc: [{ value: '', disabled: true }],
    address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    code: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email: ['', [Validators.required, emailValidator()]],
    cellPhone: ['09', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
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
      code: this.form.controls.code.value,
      email: this.form.controls.email.value,
      cellPhone: this.form.controls.cellPhone.value,
      address: this.form.controls.address.value,
    };

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.emisorService.addSubsidiary(newEstablishment)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.notification.push({
            message: 'Establecimiento creado correctamente',
            type: 'success',
          });
          this.form.reset({
            ruc: this.form.controls.ruc.value,
            address: '',
            code: '',
            email: '',
            cellPhone: '09',
          });
          this.createEstablecimiento.emit({
            code: newEstablishment.code,
            address: newEstablishment.address,
            ideSubsidiary: Number(resp.data),
            email: newEstablishment.email,
            cellPhone: newEstablishment.cellPhone,
            ruc: this.ruc,
          });
        }
      });
  }
}
