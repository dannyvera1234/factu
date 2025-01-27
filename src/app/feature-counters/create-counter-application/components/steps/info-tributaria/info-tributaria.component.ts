import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Environment } from '@/interfaces';
import { ConfigFacturacionService, AccountingControlSystemService } from '@/utils/services';
import { CreateCounterApplicationService } from '../../../create-counter-application.service';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  CustomInputComponent,
  CustomSelectComponent,
  DocumentPickerComponent,
  FormErrorMessageComponent,
} from '@/components';

@Component({
  selector: 'app-info-tributaria',
  imports: [
    ReactiveFormsModule,
    CustomInputComponent,
    NgOptimizedImage,
    CustomSelectComponent,
    NgClass,
    FormErrorMessageComponent,
    DocumentPickerComponent,
  ],
  templateUrl: './info-tributaria.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoTributariaComponent {
  public readonly form = this.formService.form.controls.step_2;

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
    public readonly formService: CreateCounterApplicationService,
    public readonly config: ConfigFacturacionService,
    public readonly controlService: AccountingControlSystemService,
  ) {
    this.getEnvironments();
    this.getPersonType();
  }

  private getEnvironments(): void {
    this.controlService.getEnvironments().subscribe((res) => this.environmentList.set(res.data));
  }

  private getPersonType(): void {
    this.controlService.getPersonType().subscribe((res) => this.personType.set(res.data));
  }

  onCheckboxChange(event: Event, code: string): void {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      this.form.controls.environmentCode.setValue(code);
    } else {
      this.form.controls.environmentCode.setValue('');
    }
  }

  toggle(event: Event, control: 'electronicDocuments') {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.form.controls[control].enable();
    } else {
      this.form.controls[control].disable();
    }
  }

  public submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formService.next();
  }
}
