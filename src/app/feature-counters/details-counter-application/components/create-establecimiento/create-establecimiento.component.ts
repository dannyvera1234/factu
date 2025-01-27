import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, output, signal } from '@angular/core';
import { CustomInputComponent } from '@/components';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { of, mergeMap, finalize } from 'rxjs';
import { emailValidator } from '@/utils/validators';
import { NgClass } from '@angular/common';
import { CountersService } from '@/services/counters.service';
import { NotificationService } from '@/utils/services';

@Component({
  selector: 'app-create-establecimiento',
  imports: [CustomInputComponent, ReactiveFormsModule, NgClass],
  templateUrl: './create-establecimiento.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEstablecimientoComponent {
  @Input({ required: true }) set data(value: any) {
    this.personaRolIde.set(value.idePersonaRol);
    this.ruc.set(value.ruc);
    this.form.patchValue({
      ruc: value.ruc,
    });
  }

  public readonly ruc = signal<string | null>(null);

  public readonly personaRolIde = signal<number | null>(null);

  public readonly loading = signal(false);

  public readonly logoPreview = signal<string | null>(null);

  @Output() public readonly createEstablecimiento = new EventEmitter<any | null>();

  constructor(
    private _fb: FormBuilder,
    private readonly counterService: CountersService,
    private readonly notification: NotificationService,
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
      personaRolIde: this.personaRolIde(),
      dataToAdd: {
        code: this.form.controls.code.value,
        email: this.form.controls.email.value,
        cellPhone: this.form.controls.cellPhone.value,
        address: this.form.controls.address.value,
      },
    };

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.counterService.createEstablecimiento(newEstablishment)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {

        if (resp.status === 'OK') {
          this.notification.push({
            message: 'Establecimiento creado correctamente',
            type: 'success',
          });
          this.form.reset();
        this.form.setValue({
          ruc: '',
          address: '',
          code: '',
          email: '',
          cellPhone: '09',
        });
          this.createEstablecimiento.emit({
           code: newEstablishment.dataToAdd.code,
           address: newEstablishment.dataToAdd.address,
            ideSubsidiary: Number(resp.data),
            email: newEstablishment.dataToAdd.email,
            cellPhone: newEstablishment.dataToAdd.cellPhone,
            ruc: this.ruc(),
          });
        }

      });
  }
}
