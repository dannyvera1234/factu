import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CustomInputComponent } from '@/components/inputs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { CreateApplicationService } from '../../../create-applications.service';
import { ConfigFacturacionService } from '@/utils/services';
import { emailValidator, onlyNumbersValidator } from '@/utils/validators';

@Component({
  selector: 'app-info-personal',
  imports: [CustomInputComponent, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './info-personal.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoPersonalComponent {
  public readonly form = this.formService.form.controls.step_1;

  constructor(
    private readonly formService: CreateApplicationService,
    private readonly _fb: FormBuilder,
    public readonly config: ConfigFacturacionService
  ) {}

  removeEmail(index: number): void {
    if (index > 0) {
      this.form.controls.emails.removeAt(index);
    }
  }

  public addEmail(): void {
    this.form.controls.emails.push(
      this._fb.group({
        email: ['', [Validators.required, Validators.maxLength(50), emailValidator()]],
      }),
    );
  }

  public addPhone(): void {
    this.form.controls.phones.push(
      this._fb.group({
        phone: ['', [Validators.required, Validators.maxLength(10), onlyNumbersValidator()]],
      }),
    );
  }
  removePhone(index: number): void {
    if (index > 0) {
      this.form.controls.phones.removeAt(index);
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
