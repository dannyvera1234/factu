import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CreateApplicationService } from '../../../create-applications.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomInputComponent } from '@/components';

@Component({
  selector: 'app-planes',
  imports: [NgOptimizedImage, ReactiveFormsModule, CustomInputComponent],
  templateUrl: './planes.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanesComponent {
  public readonly form = this.formService.form.controls.step_3;

  constructor(public readonly formService: CreateApplicationService) {}

  public submit(): void {
    if (this.formService.form.invalid) {
      this.formService.form.markAllAsTouched();
      return;
    }

    this.formService.next();
  }
}
