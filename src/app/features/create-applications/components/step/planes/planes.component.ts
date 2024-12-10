import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CreateApplicationService } from '../../../create-applications.service';

@Component({
  selector: 'app-planes',
  imports: [NgOptimizedImage],
  templateUrl: './planes.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanesComponent {
  constructor(public readonly formService: CreateApplicationService) {}

  public submit(): void {
    if (this.formService.form.invalid) {
      this.formService.form.markAllAsTouched();
      return;
    }

    this.formService.next();
  }
}
