import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { of, mergeMap, finalize } from 'rxjs';
import { ByApplicationCounter, Environment } from '../../../../interfaces';
import { CountersService } from '../../../../services/counters.service';
import { ConfigFacturacionService, AccountingControlSystemService } from '../../../../utils/services';
import { CustomInputComponent, CustomSelectComponent, FormErrorMessageComponent } from '../../../../components';
import { NgClass } from '@angular/common';
import { EmpresaService } from '../../../../services/service-empresas';
import { UserService } from '../../../../services';

@Component({
  selector: 'app-update-emisor-tributaria',
  imports: [ReactiveFormsModule, CustomInputComponent, NgClass, FormErrorMessageComponent, CustomSelectComponent],
  templateUrl: './update-emisor-tributaria.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateEmisorTributariaComponent {
  @Input({ required: true }) set infoTributario(value: ByApplicationCounter) {
    this.form.patchValue({
      typePerson: value.typePerson,
      razon_social: value.socialReason,
      mainAddress: value.mainAddress,
      comercialName: value.comercialName,
      retentionAgent: value.retentionAgent,
      specialContributor: value.specialContributor,
      requiredAccounting: value.requiredAccounting,
      rimpe: value.rimpe,
      rimpePopular: value.rimpePopular,
      environmentCode: value.environmentCode,
    });
  }

  @Output() public readonly updateTributaria = new EventEmitter<any | null>();

  public readonly loading = signal(false);

  public readonly personType = signal<any[]>([]);

  public readonly useId = computed(() => this.user.getUserData()!.user.isDemo);

  public readonly typePerson = computed<{ values: string[]; labels: string[] }>(() =>
    this.personType().reduce(
      (acc, item) => {
        acc.values.push(item.value2);
        acc.labels.push(item.value1);
        return acc;
      },
      { values: [], labels: [] } as { values: string[]; labels: string[] },
    ),
  );

  public readonly environmentList = signal<Environment[]>([]);
  constructor(
    private readonly _fb: FormBuilder,
    private readonly emisorService: EmpresaService,
    public readonly controlService: AccountingControlSystemService,
    private readonly user: UserService,
  ) {
    this.getPersonType();
    this.getEnvironments();
  }

  public readonly form = this._fb.group({
    typePerson: ['', [Validators.required]],
    razon_social: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]],
    mainAddress: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]],
    comercialName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]],
    retentionAgent: [''],
    specialContributor: ['', [Validators.maxLength(50)]],
    requiredAccounting: [false],
    rimpe: [false],
    rimpePopular: [false],
    environmentCode: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
  });

  public onUsernameInput(event: any, sourceField: string): void {
    const inputValue = event.target.value;

    const newValue = inputValue.replace(/[^0-9]/g, '');

    event.target.value = newValue;

    const control = this.form.get([sourceField]);

    if (control) {
      control.setValue(newValue);
    }
  }

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

  onCheckboxChange(event: Event, code: string): void {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      this.form.controls.environmentCode.setValue(code);
    } else {
      this.form.controls.environmentCode.setValue('');
    }
  }

  private getEnvironments(): void {
    this.controlService.getEnvironments().subscribe((res) => {
      let environmentList = res.data;

      if (this.useId()) {
        environmentList = environmentList.filter((ambiente: Environment) => ambiente.code !== '2');
      }

      this.environmentList.set(environmentList);
    });
  }

  private getPersonType(): void {
    this.controlService.getPersonType().subscribe((res) => this.personType.set(res.data));
  }

  public submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const updateByInfoTributaria = {
      socialReason: this.form.value.razon_social,
      typePerson: this.form.value.typePerson,
      environmentCode: this.form.value.environmentCode,
      mainAddress: this.form.value.mainAddress,
      comercialName: this.form.value.comercialName,
      requiredAccounting: this.form.value.requiredAccounting,
      rimpe: this.form.value.rimpe,
      rimpePopular: this.form.value.rimpePopular,
      specialContributor: this.form.value.specialContributor,
      retentionAgent: this.form.value.retentionAgent,
    };

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.emisorService.updateInfoTributario(updateByInfoTributaria)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.updateTributaria.emit({
            typePerson: this.form.value.typePerson,
            socialReason: this.form.value.razon_social,
            mainAddress: this.form.value.mainAddress,
            comercialName: this.form.value.comercialName,
            retentionAgent: this.form.value.retentionAgent,
            specialContributor: this.form.value.specialContributor,
            requiredAccounting: this.form.value.requiredAccounting,
            rimpe: this.form.value.rimpe,
            rimpePopular: this.form.value.rimpePopular,
            environmentCode: this.form.value.environmentCode,
            idePersonaRol: Number(resp.data),
          });
        }
      });
  }
}
