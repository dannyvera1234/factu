import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInputComponent } from '@/components';
import { of, mergeMap, finalize } from 'rxjs';
import { emailValidator } from '@/utils/validators';
import { NgClass } from '@angular/common';
import { CountersService } from '@/services/counters.service';

@Component({
  selector: 'app-update-establecimiento',
  imports: [ReactiveFormsModule, CustomInputComponent, NgClass],
  templateUrl: './update-establecimiento.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateEstablecimientoComponent {
  @Input({ required: true }) set dataEstableciemiento(value: any) {
    this.ideSubsidiary.set(value.ideSubsidiary);
    this.form.patchValue({
      ruc: value.ruc,
      address: value.address,
      code: value.code,
      email: value.email,
      cellPhone: value.cellPhone,
    });
  }

  public readonly ideSubsidiary = signal<number | null>(null);

  public readonly loading = signal(false);

  public readonly logoPreview = signal<string | null>(null);

  @Output() public readonly establecimientoUpdate = new EventEmitter<any | null>();

  constructor(
    private _fb: FormBuilder,
    private readonly counterService: CountersService,
  ) {}

  public readonly form = this._fb.group({
    ruc: [{ value: '', disabled: true }],
    address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    code: [{ value: '', disabled: true }],
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
      ideSubsidiary: this.ideSubsidiary(),
      dataToUpdate: {
        address: this.form.controls.address.value,
        code: this.form.get('code')?.value,
        email: this.form.controls.email.value,
        cellPhone: this.form.controls.cellPhone.value,
      },
    };

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.counterService.updateEstablecimiento(newEstablishment)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.establecimientoUpdate.emit({
            ideSubsidiary: Number(resp.data),
            code: this.form.get('code')?.value,
            email: this.form.controls.email.value,
            address: this.form.controls.address.value,
            cellPhone: this.form.controls.cellPhone.value,
            ruc: this.form.controls.ruc.value,
          });
        }
      });
  }
}
