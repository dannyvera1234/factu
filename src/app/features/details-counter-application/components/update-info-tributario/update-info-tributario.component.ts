import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CustomInputComponent, CustomSelectComponent, DocumentPickerComponent, FormErrorMessageComponent } from '@/components';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { onlyNumbersValidator } from '@/utils/validators';
import { Environment } from '@/interfaces';
import { AccountingControlSystemService, ConfigFacturacionService } from '@/utils/services';

type StatementType = {
  certificatePassword?: string;
  file?: File | null;
};

@Component({
  selector: 'app-update-info-tributario',
  imports: [CustomInputComponent, CustomSelectComponent, ReactiveFormsModule, NgClass, FormErrorMessageComponent, DocumentPickerComponent],
  templateUrl: './update-info-tributario.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateInfoTributarioComponent {
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
    code: ['001', [Validators.required, Validators.minLength(3), Validators.maxLength(50), onlyNumbersValidator()]],
    electronicDocuments: this._fb.control({ value: false, disabled: true }),
    statement: this._fb.control<StatementType | null>(null),
    environmentCode: ['1', [Validators.required]],
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

  toggle(event: Event, control: 'electronicDocuments') {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.form.controls[control].enable();
    } else {
      this.form.controls[control].disable();
    }
  }

  public submit() {
    console.log(this.form.value);
  }
}
