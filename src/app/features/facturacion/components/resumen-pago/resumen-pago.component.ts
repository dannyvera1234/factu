import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { AccountingControlSystemService } from '@/utils/services';
import { GeneriResp } from '../../../../interfaces';
import { FormsModule } from '@angular/forms';
import { CreateFacturacionService } from '../../create-facturacion.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-resumen-pago',
  imports: [KeyValuePipe, FormsModule],
  templateUrl: './resumen-pago.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumenPagoComponent {
  ivaPercentage = signal(12);
  products = signal<any[]>([]);

  constructor(
    private readonly controlService: AccountingControlSystemService,
    public readonly configFactu: CreateFacturacionService,
  ) {
    this.getPayForms();
    this.getImpuestoIVA();
    toObservable(this.listProduct)
      .pipe(takeUntilDestroyed())
      .subscribe((updatedProducts) => {
        console.log('data recibe', updatedProducts);
      });
  }

  public readonly listProduct = computed(() => this.configFactu.products());

  calculateSubtotals = computed(() => {
    const subtotals = {
      sinImpuestos: 0,
      con12: 0,
      con0: 0,
      noObjetoIva: 0,
      exentoIva: 0,
      descuentos: 0,
      ice: 0,
    };

    this.products().forEach((product) => {
      const subtotal = product.cantidad * product.precioUnitario;
      subtotals.sinImpuestos += subtotal;

      if (product.tarifa === 12) {
        subtotals.con12 += subtotal;
      } else if (product.tarifa === 0) {
        subtotals.con0 += subtotal;
      } else if (product.tarifa === -1) {
        subtotals.noObjetoIva += subtotal;
      } else if (product.tarifa === -2) {
        subtotals.exentoIva += subtotal;
      }

      subtotals.descuentos += subtotal * (product.descuento / 100);
      subtotals.ice += product.valorIce;
    });

    return subtotals;
  });

  public readonly paymentMethods = signal<GeneriResp<any[]> | null>(null);

  selectedPaymentMethod = signal<string>('');

  public readonly IVA = signal<GeneriResp<any[]> | null>(null);

  private getPayForms() {
    this.controlService.getTypesPayForm().subscribe((response) => {
      if (response.status === 'OK') {
        this.paymentMethods.set(response);
      }
    });
  }
  getImpuestoIVA(): void {
    const IVA = 'IVA';
    this.controlService.impuestoIVA(IVA).subscribe((response) => {
      if (response.status === 'OK') {
        console.log(response);
        this.IVA.set(response);
      }
    });
  }
}
