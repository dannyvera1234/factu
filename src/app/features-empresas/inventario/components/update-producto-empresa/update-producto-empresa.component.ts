import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { of, mergeMap, finalize } from 'rxjs';
import { CountersService } from '@/services/counters.service';
import { AccountingControlSystemService, NotificationService } from '@/utils/services';
import { onlyNumbersDecimalsValidator } from '@/utils/validators';
import { NgClass } from '@angular/common';
import { CustomInputComponent, CustomSelectComponent } from '@/components';
import { InventarioService } from '../../../../services/service-empresas';

@Component({
  selector: 'app-update-producto-empresa',
  imports: [NgClass, CustomSelectComponent, CustomInputComponent, ReactiveFormsModule],
  templateUrl: './update-producto-empresa.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateProductoEmpresaComponent {
@Input({ required: true }) set updateProduct(value: any) {
    this.form.patchValue({
      name: value.name,
      description: value.description,
      tariffCodeIva: value.tariffCodeIva,
      tariffCodeIce: value.tariffCodeIce,
      mainCode: value.mainCode,
      auxiliaryCode: value.auxiliaryCode,
      unitPrice: value.unitPrice,
      stock: value.stock,
      productType: value.productType,
      ide: value.ide,
    });
  }

  public readonly loading = signal(false);

  public readonly IVA = signal<any[]>([]);

  public readonly ICE = signal<any[]>([]);

  public readonly productType = signal<any[]>([]);

  @Output() public readonly update = new EventEmitter<any | null>();

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
    private readonly inventarioService: InventarioService,
    private readonly controlService: AccountingControlSystemService,
    private readonly notification: NotificationService,
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

  onAmountInput(event: any, sourceField: string): void {
    let inputValue = event.target.value;

    // Reemplazar cualquier cosa que no sea número o punto decimal
    inputValue = inputValue.replace(/[^0-9.]/g, '');

    // Asegurarse de que solo haya un punto decimal
    const decimalCount = (inputValue.match(/\./g) || []).length;
    if (decimalCount > 1) {
      inputValue = inputValue.substring(0, inputValue.lastIndexOf('.')) + inputValue.slice(inputValue.lastIndexOf('.'));
    }

    // Limitar a dos decimales
    if (inputValue.includes('.')) {
      const [integerPart, decimalPart] = inputValue.split('.');
      inputValue = `${integerPart}.${decimalPart.slice(0, 2)}`;
    }

    // Asignar el valor ajustado al input
    event.target.value = inputValue;

    const control = this.form.get(sourceField);
    if (control) {
      control.setValue(inputValue);
    }
  }

  public readonly form = this._fb.group({
    ide: [''],
    tariffCodeIva: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    productType: ['', [Validators.required]],
    tariffCodeIce: [''],
    mainCode: [{ value: '', disabled: true }],
    auxiliaryCode: ['', [, Validators.minLength(1), Validators.maxLength(50)]],
    description: [''],
    unitPrice: [0, [Validators.required, onlyNumbersDecimalsValidator()]],
    stock: [{ value: '', disabled: true }],
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
      productIde: this.form.controls.ide.value,
      dataToUpdate: {
        name: this.form.controls.name.value,
        description: this.form.controls.description.value,
        tariffCodeIva: this.form.controls.tariffCodeIva.value,
        tariffCodeIce: this.form.controls.tariffCodeIce.value || null,
        mainCode: this.form.controls.mainCode.value,
        auxiliaryCode: this.form.controls.auxiliaryCode.value,
        unitPrice: this.form.controls.unitPrice.value,
        stock: this.form.controls.stock.value,
        productType: this.form.controls.productType.value,
      },
    };

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.inventarioService.updateProduct(dataProduct)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((res) => {
        if (res.status === 'OK') {
          this.notification.push({
            message: 'Producto actualizado correctamente',
            type: 'success',
          });
          this.update.emit({
            name: this.form.controls.name.value,
            mainCode: this.form.controls.mainCode.value,
            stock: this.form.controls.stock.value,
            availableStock: this.form.controls.stock.value,
            tariffCodeIva: this.form.controls.tariffCodeIva.value,
            tariffDesIva: this.IVA().find((item) => item.codeTariff === this.form.controls.tariffCodeIva.value)
              ?.description,
            tariffCodeIce: this.form.controls.tariffCodeIce.value,
            unitPrice: this.form.controls.unitPrice.value,
            productType: this.productType().find((item) => item.value2 === this.form.controls.productType.value)
              ?.value2,
            ide: Number(res.data),
            auxiliaryCode: this.form.controls.auxiliaryCode.value,
            description:this.form.controls.description.value
          });
          this.form.reset();
        }
      });
  }
}
