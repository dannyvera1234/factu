import { ChangeDetectionStrategy, Component, computed, Input, signal } from '@angular/core';
import { CustomInputComponent, CustomSelectComponent } from '@/components';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Environment, IdentificationType } from '@/interfaces';
import {
  ageValidator,
  cedulaValidator,
  emailValidator,
  onlyLettersValidator,
  onlyNumbersValidator,
  rucValidator,
} from '@/utils/validators';
import { AccountingControlSystemService, ConfigFacturacionService } from '@/utils/services';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-update-info-persona',
  imports: [CustomInputComponent, CustomSelectComponent, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './update-info-persona.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateInfoPersonaComponent {
  // @Input({required: true}) dataInfoPersona!: any;

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
    identificationNumber: ['', [Validators.required]],
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

    console.log(this.form.value);
  }
}
