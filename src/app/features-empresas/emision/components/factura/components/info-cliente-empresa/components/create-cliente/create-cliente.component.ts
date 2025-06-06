import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, Output, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { of, mergeMap, finalize } from 'rxjs';
import { CustomInputComponent, CustomSelectComponent } from '../../../../../../../../components';
import { DetailsService } from '../../../../../../../../feature-counters/details-counter-application';
import { IdentificationType } from '../../../../../../../../interfaces';
import { ClientesService } from '../../../../../../../../services/service-empresas';
import { ConfigFacturacionService, AccountingControlSystemService, NotificationService } from '../../../../../../../../utils/services';
import { onlyLettersValidator, emailValidator, onlyNumbersValidator, rucValidator, cedulaValidator } from '../../../../../../../../utils/validators';

@Component({
  selector: 'app-create-cliente',
  imports: [CustomInputComponent, NgClass, CustomSelectComponent, ReactiveFormsModule],
  templateUrl: './create-cliente.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateClienteComponent {
public readonly loading = signal(false);

  public readonly identificationLabel = signal<string>('Identificación');

  @Output() public readonly created = new EventEmitter<any | null>();

  public readonly typeDocument = signal<IdentificationType[]>([]);

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
    private readonly clientesService: ClientesService,
    private readonly notification: NotificationService,
    private readonly detailsService: DetailsService,
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
    address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
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
    this.controlService.getTypesCustomer().subscribe((res) => this.typeDocument.set(res.data));
  }

  public submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const updateByInfoPersona = {
      names: this.form.value.names,
      lastName: this.form.value.lastName,
      address: this.form.value.address,
      typeDocument: this.form.value.typeDocument,
      identificationNumber: this.form.value.identificationNumber,
      email: this.form.value.email,
      cellPhone: this.form.value.cellPhone,
    };

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.clientesService.addCustomer(updateByInfoPersona)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((res) => {
        if (res.status === 'OK') {
          this.notification.push({
            message: 'El cliente ha sido creado con éxito.',
            type: 'success',
          });
          this.created.emit({
            ideCustomer: Number(res.data),
            names: this.form.value.names,
            lastName: this.form.value.lastName,
            address: this.form.value.address,
            typeDocument: this.form.value.typeDocument,
            identificationNumber: this.form.value.identificationNumber,
            email: this.form.value.email,
            cellPhone: this.form.value.cellPhone,
            status: res.status,
          });
          this.detailsService.info.set({
            personaRolIde: Number(res.data),
           });
          this.form.reset({
            cellPhone: '09',
            typeDocument: '',
            email: '',
            address: '',
            identificationNumber: '',
            names: '',
            lastName: '',
          });
        }
      });
  }
}
