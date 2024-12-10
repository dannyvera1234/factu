import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CreateApplicationService } from '../../../create-applications.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomInputComponent } from '@/components/inputs';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-info-tributaria',
  imports: [ReactiveFormsModule,CustomInputComponent, NgOptimizedImage],
  templateUrl: './info-tributaria.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoTributariaComponent {
  public readonly form = this.formService.form.controls.step_2;

  constructor(public readonly formService: CreateApplicationService) {}

  public submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formService.next();
  }
}
