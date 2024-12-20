import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';
import { CustomInputComponent } from '../../components';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { onlyNumbersDecimalsValidator } from '@/utils/validators';
import { AccountingControlSystemService } from '../../utils/services';
import { finalize, mergeMap, of } from 'rxjs';
import { CreatePlan } from '../../interfaces';

@Component({
  selector: 'app-create-plan',
  imports: [CustomInputComponent, ReactiveFormsModule],
  templateUrl: './create-plan.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePlanComponent {
  public readonly loading = signal(false);

  @Output() public readonly createPlan = new EventEmitter<any | null>();

  constructor(
    private readonly _fb: FormBuilder,
    private readonly controlService: AccountingControlSystemService,
  ) {}

  public form = this._fb.group({
    title: ['', [Validators.required, Validators.maxLength(250), Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.maxLength(250), Validators.minLength(5)]],
    price: [0, [Validators.required, onlyNumbersDecimalsValidator()]],
    period: ['', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(1)]],
    characteristic: this._fb.array([
      this._fb.group({
        description: ['', [Validators.required, Validators.maxLength(250), Validators.minLength(5)]],
        order: [0],
      }),
    ]),
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

  addCharacteristic() {
    const characteristicArray = this.form.controls.characteristic;
    const newCharacteristic = this._fb.group({
      description: ['', [Validators.required]],
      order: [0, [Validators.required]],
    });
    characteristicArray.push(newCharacteristic);
  }

  removeCharacteristic(index: number) {
    const characteristicArray = this.form.controls.characteristic;
    if (characteristicArray.length > 1) {
      characteristicArray.removeAt(index);
    }
  }

  public submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const createPlan = {
      digitalMediaIds: [1],
      title: this.form.controls.title.value,
      description: this.form.controls.description.value,
      price: Number(this.form.controls.price.value),
      period: this.form.controls.period.value,
      amount: Number(this.form.controls.amount.value),
      characteristic: this.form.controls.characteristic.value.map((item) => ({
        description: item.description,
        order: Number(item.order),
      })),
    } as CreatePlan;

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.controlService.createPlanes(createPlan)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => this.createPlan.emit(resp));
  }
}
