import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CreateApplicationService } from '../../../create-applications.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountingControlSystemService } from '@/utils/services';
import { Plan } from '@/interfaces';
import { FormErrorMessageComponent } from '@/components';

@Component({
  selector: 'app-planes',
  imports: [NgOptimizedImage, ReactiveFormsModule, CurrencyPipe, FormErrorMessageComponent],
  templateUrl: './planes.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanesComponent {
  public readonly form = this.formService.form.controls.step_3;

  public readonly selectedPlan = signal<number | null>(null);

  public readonly planes = signal<Plan[] | null>([]);

  constructor(
    public readonly formService: CreateApplicationService,
    public readonly controlService: AccountingControlSystemService,
  ) {
    this.getPlanes();
  }

  public submit(): void {
    if (this.formService.form.invalid) {
      this.formService.form.markAllAsTouched();
      return;
    }

    this.formService.next();
  }

  selectPlan(planIde: any) {
    this.selectedPlan.set(planIde);

    this.form.controls.planIde.setValue(planIde);
  }

  private getPlanes() {
    this.controlService.getPlanes().subscribe((resp) => this.planes.set(resp.data));
  }
}
