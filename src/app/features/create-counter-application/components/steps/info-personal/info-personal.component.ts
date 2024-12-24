import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CustomInputComponent, CustomSelectComponent } from '@/components';
import { IdentificationType } from '@/interfaces';
import { AccountingControlSystemService, ConfigFacturacionService } from '@/utils/services';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { cedulaValidator, rucValidator } from '@/utils/validators';
import { CreateCounterApplicationService } from '../../../create-counter-application.service';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-info-personal',
  imports: [CustomInputComponent, CustomSelectComponent, ReactiveFormsModule, NgOptimizedImage, RouterLink],
  templateUrl: './info-personal.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoPersonalComponent {
  public readonly form = this.formService.form.controls.step_1;

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
    public readonly formService: CreateCounterApplicationService,
    public readonly config: ConfigFacturacionService,
    public readonly controlService: AccountingControlSystemService,
  ) {
    this.getIdentificationTypes();

    this.form.controls.typeDocument.valueChanges.subscribe((value: any) => {
      this.identificationNumberValidators(value);
    });
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
    this.controlService.getIdentificationTypes().subscribe((res) => this.typeDocument.set(res.data));
  }

  public submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formService.next();
  }
}
