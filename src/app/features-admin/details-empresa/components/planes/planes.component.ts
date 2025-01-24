import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Plan } from '@/interfaces';
import { AccountingControlSystemService } from '@/utils/services';
import { CurrencyPipe, NgClass } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlanesService } from '@/services/service-admin';
import { FormErrorMessageComponent } from '@/components';
import { finalize, mergeMap, of } from 'rxjs';

@Component({
  selector: 'app-planes',
  imports: [CurrencyPipe, ReactiveFormsModule, FormErrorMessageComponent, NgClass],
  templateUrl: './planes.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanesComponent {
  @Input({ required: true }) idePersonaRol!: number;

  public readonly selectedPlan = signal<number | null>(null);

  public readonly planes = signal<Plan[] | null>([]);

  public readonly loading = signal(false);

  @Output() public readonly plan = new EventEmitter<number | null>();

  constructor(
    public readonly planesService: PlanesService,
    public readonly controlService: AccountingControlSystemService,
    private readonly _fb: FormBuilder,
  ) {
    this.getPlanes();
  }

  form = this._fb.group({
    planIde: ['', [Validators.required]],
  });

  selectPlan(planIde: number) {
    if (planIde) {
      this.selectedPlan.set(planIde);
    }
  }

  submit() {
    const planIde = this.selectedPlan();

    if (planIde) {
      of(this.loading.set(true))
        .pipe(
          mergeMap(() => this.planesService.savePlan(this.idePersonaRol, planIde)),
          finalize(() => this.loading.set(false)),
        )
        .subscribe((resp) => {
          if (resp.status === 'OK') {
            this.plan.emit(resp);
          }
        });
    }
  }

  getPlanes() {
    this.planesService.listPlan().subscribe((resp) => {
      if (resp.status === 'OK') {
        this.planes.set(resp.data);
      }
    });
  }
}
