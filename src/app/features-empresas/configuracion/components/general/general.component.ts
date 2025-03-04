import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { CustomInputComponent } from '../../../../components';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { of, mergeMap, finalize } from 'rxjs';
import { ByApplicationCounter } from '../../../../interfaces';
import { EmpresaService } from '../../../../services/service-empresas';
import { onlyLettersValidator, emailValidator, onlyNumbersValidator, ageValidator } from '../../../../utils/validators';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-general',
  imports: [CustomInputComponent, ReactiveFormsModule, NgClass],
  templateUrl: './general.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralComponent {
 @Input({ required: true }) set infoEmisor(value: ByApplicationCounter) {
    this.form.patchValue({
      names: value.names,
      lastName: value.lastName,
      identificationNumber: value.identificationNumber,
      email: value.email,
      cellPhone: value.cellPhone,
      dateBirth: value.dateBirth,
    });
  }

  @Output() public readonly updateEmisor = new EventEmitter<any | null>();

  public readonly loading = signal(false);

  public readonly maxDate = computed(() => {
    const today = new Date();
    const maxDate = today.toISOString().split('T')[0];
    return maxDate;
  });

  constructor(
    private readonly _fb: FormBuilder,
    private readonly emisorService: EmpresaService,
  ) {}

  public readonly form = this._fb.group({
    names: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), onlyLettersValidator()]],
    lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), onlyLettersValidator()]],
    identificationNumber: [{ value: '', disabled: true }],
    email: ['', [Validators.required, emailValidator()]],
    cellPhone: [
      '09',
      [Validators.required, onlyNumbersValidator(), Validators.maxLength(10), Validators.minLength(10)],
    ],
    dateBirth: ['', [ageValidator()]],
  });

  public onletterInput(event: any, sourceField: string): void {
    const inputValue = event.target.value;

    // Permitir solo letras y espacios
    const newValue = inputValue.replace(/[^a-zA-Z\s]/g, '');

    // Actualizar el valor del campo de entrada en el DOM
    event.target.value = newValue;

    // Obtener el control asociado en el formulario reactivo
    const control = this.form.get(sourceField);

    if (control) {
      // Actualizar el valor del control en el formulario reactivo
      control.setValue(newValue);
    }
  }

  public onUsernameInput(event: any, sourceField: string): void {
    const inputValue = event.target.value;

    const newValue = inputValue.replace(/[^0-9]/g, '');

    event.target.value = newValue;

    const control = this.form.get([sourceField]);

    if (control) {
      control.setValue(newValue);
    }
  }

  public submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const updateEmisor = {
      names: this.form.value.names,
      lastName: this.form.value.lastName,
      typeDocument: '04',
      identificationNumber: this.form.controls.identificationNumber.value,
      email: this.form.value.email,
      cellPhone: this.form.value.cellPhone,
      dateBirth: this.form.value.dateBirth || null,
    };

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.emisorService.updateEmisor(updateEmisor)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.updateEmisor.emit({
            names: this.form.value.names,
            lastName: this.form.value.lastName,
            identificationNumber: this.form.controls.identificationNumber.value,
            email: this.form.value.email,
            cellPhone: this.form.value.cellPhone,
            dateBirth: this.form.value.dateBirth,
            idePersonaRol: Number(resp.data),
          });
        }
      });
  }
}
