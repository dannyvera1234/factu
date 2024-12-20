import { ChangeDetectionStrategy, Component, computed, EventEmitter, Output, signal } from '@angular/core';
import { CustomInputComponent, CustomSelectComponent } from '../../components';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { onlyLettersValidator, emailValidator, rucValidator, cedulaValidator } from '../../utils/validators';
import { PerfilesService } from '../../services';
import { IdentificationType } from '../../interfaces';
import { finalize, mergeMap, of } from 'rxjs';
import { CountersService } from '../../services/counters.service';

@Component({
  selector: 'app-create-counter',
  imports: [CustomInputComponent, CustomSelectComponent, ReactiveFormsModule],
  templateUrl: './create-counter.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCounterComponent {
  public readonly typeDocument = signal<IdentificationType[]>([]);

  public readonly loading = signal(false);

  public readonly identificationLabel = signal<string>('Identificación');

  @Output() createCounter = new EventEmitter<any | null>();

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

  constructor(
    private _fb: FormBuilder,
    private readonly perfilService: PerfilesService,
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
    identificationNumber: ['', [Validators.required]],
    email: ['', [Validators.required, emailValidator()]],
    cellPhone: ['09', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
    amountCustomer: ['2', [Validators.required, Validators.min(1)]],
  });

  public onUsernameInput(event: any, sourceField: string): void {
    const inputValue = event.target.value;

    const newValue = inputValue.replace(/[^0-9]/g, '');

    event.target.value = newValue;

    const control = this.form.get(sourceField);

    if (control) {
      control.setValue(newValue);
    }
  }

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

  private getIdentificationTypes() {
    this.perfilService.getIdentificationUser().subscribe((res) => this.typeDocument.set(res.data));
  }

  public submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const createCounter = {
      names: this.form.value.names,
      lastName: this.form.value.lastName,
      typeDocument: this.form.value.typeDocument,
      identificationNumber: this.form.value.identificationNumber,
      email: this.form.value.email,
      cellPhone: this.form.value.cellPhone,
      amountCustomer: Number(this.form.value.amountCustomer),
    }

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.counterService.createCounter(createCounter)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => this.createCounter.emit(resp.data));
  }
}
