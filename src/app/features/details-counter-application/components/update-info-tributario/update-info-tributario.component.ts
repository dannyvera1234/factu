import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { CustomInputComponent, CustomSelectComponent, FormErrorMessageComponent } from '@/components';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ByApplicationCounter, Environment } from '@/interfaces';
import { AccountingControlSystemService, ConfigFacturacionService } from '@/utils/services';
import { finalize, mergeMap, of } from 'rxjs';
import { CountersService } from '@/services/counters.service';


@Component({
  selector: 'app-update-info-tributario',
  imports: [CustomInputComponent, CustomSelectComponent, ReactiveFormsModule, NgClass, FormErrorMessageComponent],
  templateUrl: './update-info-tributario.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateInfoTributarioComponent {
  @Input({ required: true }) set infoTributario(value: ByApplicationCounter) {
    this.idePersonaRol.set(value.idePersonaRol);
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

  public readonly idePersonaRol = signal<number | null>(null);

  @Output() public readonly updateTributaria = new EventEmitter<any | null>();

  public readonly loading = signal(false);

  public readonly personType = signal<any[]>([]);

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
    public readonly config: ConfigFacturacionService,
    public readonly controlService: AccountingControlSystemService,
    public readonly counterService: CountersService,
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
  onCheckboxChange(event: Event, code: string): void {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      this.form.controls.environmentCode.setValue(code);
    } else {
      this.form.controls.environmentCode.setValue('');
    }
  }

  private getEnvironments(): void {
    this.controlService.getEnvironments().subscribe((res) => this.environmentList.set(res.data));
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
      personaRolIde: this.idePersonaRol(),
      dataToUpdateVO: {
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
      },
    };

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.counterService.updateInfoTributario(updateByInfoTributaria)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp)=>{
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
