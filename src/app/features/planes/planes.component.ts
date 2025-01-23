import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ModalComponent } from '../../components';
import { CreatePlanComponent } from '../create-plan/create-plan.component';
import { AccountingControlSystemService } from '../../utils/services';
import { Plan } from '../../interfaces';
import { TextInitialsPipe } from '../../pipes';
import { finalize, mergeMap, of } from 'rxjs';

@Component({
  selector: 'app-planes',
  imports: [NgOptimizedImage, ModalComponent, CreatePlanComponent, CurrencyPipe, TextInitialsPipe],
  templateUrl: './planes.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanesComponent {
  public readonly planes = signal<Plan[] | null>([]);

  public readonly loading = signal(false);

  constructor(private readonly controlService: AccountingControlSystemService) {
    this.getPlanes();
  }
  public updatePlan(plan:any):void {

  }

  private getPlanes() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.controlService.getPlanes()),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => this.planes.set(resp.data));
  }
}
