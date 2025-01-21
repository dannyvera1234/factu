import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInputComponent, CustomSelectComponent } from '@/components';
import { NgClass } from '@angular/common';
import { AccountingControlSystemService, NotificationService } from '@/utils/services';
import { CountersService } from '@/services/counters.service';
import { onlyNumbersDecimalsValidator } from '@/utils/validators';
import { finalize, mergeMap, of } from 'rxjs';
import { DetailsService } from '../../details.service';

@Component({
  selector: 'app-create-producto',
  imports: [ReactiveFormsModule, CustomInputComponent, NgClass, CustomSelectComponent],
  templateUrl: './create-producto.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProductoComponent {
  @Input({ required: true }) personaRolIde!: number;

  public readonly loading = signal(false);

  public readonly IVA = signal<any[]>([]);

  public readonly ICE = signal<any[]>([]);

  public readonly productType = signal<any[]>([]);

  @Output() public readonly created = new EventEmitter<any | null>();

  public readonly codeTariffIVA = computed<{ values: string[]; labels: string[] }>(() =>
    this.IVA().reduce(
      (acc, item) => {
        acc.values.push(item.codeTariff);
        acc.labels.push(item.description);
        return acc;
      },
      { values: [], labels: [] } as { values: string[]; labels: string[] },
    ),
  );

  public readonly codeTariffICE = computed<{ values: string[]; labels: string[] }>(() =>
    this.ICE().reduce(
      (acc, item) => {
        acc.values.push(item.codeTariff);
        acc.labels.push(item.description);
        return acc;
      },
      { values: [], labels: [] } as { values: string[]; labels: string[] },
    ),
  );

  public readonly productTypeCode = computed<{ values: string[]; labels: string[] }>(() =>
    this.productType().reduce(
      (acc, item) => {
        acc.values.push(item.value2);
        acc.labels.push(item.value1);
        return acc;
      },
      { values: [], labels: [] } as { values: string[]; labels: string[] },
    ),
  );
  constructor(
    private readonly _fb: FormBuilder,
    private readonly countersService: CountersService,
    private readonly controlService: AccountingControlSystemService,
    private readonly notification: NotificationService,
    private readonly detailsService: DetailsService,
  ) {
    this.getImpuestoIVA();
    this.getImpuestoICA();
    this.getTypesProduct();
  }

  onUsernameInput(event: any, sourceField: string): void {
    const inputValue = event.target.value;

    const newValue = inputValue.replace(/[^0-9]/g, '');

    event.target.value = newValue;

    const control = this.form.get(sourceField);

    if (control) {
      control.setValue(newValue);
    }
  }

  public readonly form = this._fb.group({
    ice: { value: false, disabled: true },
    stockCount: { value: false, disabled: true },
    tariffCodeIva: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    productType: ['', [Validators.required]],
    tariffCodeIce: [''],
    mainCode: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    auxiliaryCode: ['', [, Validators.minLength(1), Validators.maxLength(50)]],
    description: [''],
    unitPrice: [0, [Validators.required, onlyNumbersDecimalsValidator()]],
    stock: [''],
  });

  toggle(event: Event, control: string) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.form.get(control)?.enable();
    } else {
      this.form.get(control)?.disable();
    }
  }

  getImpuestoIVA(): void {
    const IVA = 'IVA';
    this.controlService.impuestoIVA(IVA).subscribe((response) => {
      if (response.status === 'OK') {
        this.IVA.set(response.data);
      }
    });
  }

  getImpuestoICA(): void {
    const ICE = 'ICE';
    this.controlService.impuestoIVA(ICE).subscribe((response) => {
      if (response.status === 'OK') {
        this.ICE.set(response.data);
      }
    });
  }

  getTypesProduct(): void {
    this.controlService.getTypesProduct().subscribe((response) => {
      if (response.status === 'OK') {
        this.productType.set(response.data);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dataProduct = {
      name: this.form.controls.name.value,
      description: this.form.controls.description.value,
      tariffCodeIva: this.form.controls.tariffCodeIva.value,
      tariffCodeIce: this.form.controls.tariffCodeIce.value || null,
      mainCode: this.form.controls.mainCode.value,
      auxiliaryCode: this.form.controls.auxiliaryCode.value,
      unitPrice: this.form.controls.unitPrice.value,
      stock: Number(this.form.controls.stock.value) === 0 ? null : this.form.controls.stock.value,
      subsidiaryIde: null,
      productType: this.form.controls.productType.value,
      personaRolIde: this.personaRolIde,
    };

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.countersService.createProduct(dataProduct)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((res) => {
        if (res.status === 'OK') {
          this.notification.push({
            message: 'Producto creado correctamente',
            type: 'success',
          });

          this.detailsService.info.set({
            personaRolIde: this.personaRolIde,
          });

          this.created.emit({
            name: this.form.controls.name.value,
            mainCode: this.form.controls.mainCode.value,
            stock: this.form.controls.stock.value,
            tariffCodeIva: this.form.controls.tariffCodeIva.value,
            tariffCodeIce: this.form.controls.tariffCodeIce.value,
            tariffDesIva: this.IVA().find((item) => item.codeTariff === this.form.controls.tariffCodeIva.value)
              ?.description,
            unitPrice: this.form.controls.unitPrice.value,
            productType: this.productType().find((item) => item.value2 === this.form.controls.productType.value)
              ?.value2,
            ide: Number(res.data),
            availableStock: this.form.controls.stock.value,
            description: this.form.controls.description.value,
            auxiliaryCode: this.form.controls.auxiliaryCode.value,
          });
          this.form.reset();
          this.form.patchValue({
            productType: '',
            tariffCodeIva: '',
            tariffCodeIce: '',
            unitPrice: 0,
            stock: '',
          });
        }
      });
  }
}
