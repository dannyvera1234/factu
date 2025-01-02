import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { AccountingControlSystemService } from '@/utils/services';
import { GeneriResp } from '../../../../interfaces';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resumen-pago',
  imports: [KeyValuePipe, FormsModule],
  templateUrl: './resumen-pago.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResumenPagoComponent {
  ivaPercentage = signal(12);
  products = signal<any[]>([]);

  constructor(private readonly controlService: AccountingControlSystemService) {
    this.getPayForms();
  }


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

  this.products().forEach(product => {
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

calculateTotal = computed(() => {
  const subtotals = this.calculateSubtotals();
  const baseImponible = subtotals.con12 + subtotals.con0 + subtotals.noObjetoIva + subtotals.exentoIva;
  const iva = (subtotals.con12 * this.ivaPercentage()) / 100;
  return baseImponible - subtotals.descuentos + subtotals.ice + iva;
});

public readonly paymentMethods = signal<GeneriResp<any[]>| null>(null);

selectedPaymentMethod = signal<string >('');


private getPayForms(){
  this.controlService.getTypesPayForm().subscribe((response) => {
    if (response.status === 'OK') {
      this.paymentMethods.set(response);
    }

   console.log(response);
  });
}
}
