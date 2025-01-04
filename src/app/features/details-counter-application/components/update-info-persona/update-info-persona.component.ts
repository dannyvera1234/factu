import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { CustomInputComponent, CustomSelectComponent } from '@/components';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ByApplicationCounter, IdentificationType } from '@/interfaces';
import {
  ageValidator,
  cedulaValidator,
  emailValidator,
  onlyLettersValidator,
  onlyNumbersValidator,
  rucValidator,
} from '@/utils/validators';
import { AccountingControlSystemService, ConfigFacturacionService } from '@/utils/services';
import { finalize, mergeMap, of } from 'rxjs';
import { CountersService } from '@/services/counters.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-update-info-persona',
  imports: [CustomInputComponent, CustomSelectComponent, ReactiveFormsModule, NgClass],
  templateUrl: './update-info-persona.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateInfoPersonaComponent {
  @Input({ required: true }) set infoPersonal(value: ByApplicationCounter) {
    this.idePersonaRol.set(value.idePersonaRol);
    this.form.patchValue({
      names: value.names,
      lastName: value.lastName,
      typeDocument: value.typeDocument,
      identificationNumber: value.identificationNumber,
      email: value.email,
      cellPhone: value.cellPhone,
      dateBirth: value.dateBirth,
    });

  }

  @Output() public readonly updatePersonal = new EventEmitter<any | null>();

  public readonly idePersonaRol = signal<number | null>(null);

  public readonly loading = signal(false);

  public readonly typeDocument = signal<IdentificationType[]>([]);

  public readonly identificationLabel = signal<string>('Identificación');

  public readonly transformedTypeDocument = computed<{ values: string[]; labels: string[] }>(() =>
    this.typeDocument().reduce(
      (acc, item) => {
        acc.values.push(item.code);
        acc.labels.push(item.description);
        return acc;
      },
      { values: [], labels: [] } as { values: string[]; labels: string[] },
    ),
  );

  public readonly maxDate = computed(() => {
    const today = new Date();
    const maxDate = today.toISOString().split('T')[0];
    return maxDate;
  });

  constructor(
    private readonly _fb: FormBuilder,
    public readonly config: ConfigFacturacionService,
    public readonly controlService: AccountingControlSystemService,
    private readonly counterService: CountersService,
  ) {
    this.getIdentificationTypes();

    this.form.controls.typeDocument.valueChanges.subscribe((value: any) => {
      this.identificationNumberValidators(value);
    });
  }

  public readonly form = this._fb.group({
    names: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), onlyLettersValidator()]],
    lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), onlyLettersValidator()]],
    typeDocument: ['', [Validators.required]],
    identificationNumber: [{ value: '', disabled: true }],
    email: ['', [Validators.required, emailValidator()]],
    cellPhone: [
      '09',
      [Validators.required, onlyNumbersValidator(), Validators.maxLength(10), Validators.minLength(10)],
    ],
    dateBirth: ['', [ageValidator()]],
  });

  private identificationNumberValidators(typeCode: string): void {
    const selectedType = this.typeDocument().find((type) => type.code === typeCode);

    if (selectedType) {
      const length = selectedType.length;
      this.identificationLabel.set(selectedType.description);
      const identificationControl = this.form.controls.identificationNumber;

      switch (typeCode) {
        case '04':
          identificationControl?.setValidators([
            Validators.required,
            rucValidator(),
            Validators.minLength(length),
            Validators.maxLength(length),
          ]);
          break;
        case '05':
          identificationControl?.setValidators([
            Validators.required,
            cedulaValidator(),
            Validators.minLength(length),
            Validators.maxLength(length),
          ]);
          break;
        default:
          identificationControl?.setValidators([
            Validators.required,
            Validators.minLength(length),
            Validators.maxLength(length),
          ]);
          break;
      }

      identificationControl?.updateValueAndValidity();
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

  private getIdentificationTypes() {
    this.controlService.getIdentificationTypes().subscribe((res) => this.typeDocument.set(res.data));
  }

  public submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const updateByInfoPersona = {
      personaRolIde: this.idePersonaRol(),
      dataToUpdateVO: {
      names: this.form.value.names,
      lastName: this.form.value.lastName,
      typeDocument: this.form.value.typeDocument,
      identificationNumber: this.form.get('identificationNumber')?.value,
      email: this.form.value.email,
      cellPhone: this.form.value.cellPhone,
      dateBirth: this.form.value.dateBirth || null,
      },
    };

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.counterService.updateCounterByEmisor(updateByInfoPersona)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp)=>
      {
        if (resp.status === 'OK') {
          this.updatePersonal.emit(
            {
              names: this.form.value.names,
              lastName: this.form.value.lastName,
              typeDocument: this.form.value.typeDocument,
              identificationNumber: this.form.get('identificationNumber')?.value,
              email: this.form.value.email,
              cellPhone: this.form.value.cellPhone,
              dateBirth: this.form.value.dateBirth,
              idePersonaRol: Number(resp.data),
            }
          );
        }
      }
    );
  }
}
