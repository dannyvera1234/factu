import { ChangeDetectionStrategy, Component, computed, Input, signal } from '@angular/core';
import { CreateFacturaEmpresaService } from '../../create-factura-empresa.service';
import { NotificationService } from '@/utils/services';
import { CurrencyPipe } from '@angular/common';
import { ModalComponent } from '@/components';
import { AddPaymentComponent } from './components';

@Component({
  selector: 'app-forma-pago',
  imports: [CurrencyPipe, ModalComponent, AddPaymentComponent],
  templateUrl: './forma-pago.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormaPagoComponent {
  @Input({ required: true }) set addPayment(payment: any) {
    if (!payment) return;
    this.updatePayment(payment);
    this.config.addPayments.set(null);
  }

  public readonly paymentMethods = signal<any | null>(null);

  public readonly calculateTotal = computed(() => {
    return this.config
      .detailProducts()
      ?.map((product) => ({ ...product }))
      .reduce((acc, product) => acc + product.valorTotal, 0);
  });

  constructor(
    public config: CreateFacturaEmpresaService,
    private readonly notification: NotificationService,
  ) {}

  updatePayment(payment: any): void {
    this.paymentMethods.update((currentPaymentMethods: any[] = []) => {
      // Aseguramos que currentPaymentMethods sea un array válido
      const methods = Array.isArray(currentPaymentMethods) ? currentPaymentMethods : [];

      // Verificamos si el pago ya existe en la lista por el 'code' dentro de metodoPago
      const paymentExists = methods.some((method) => method.metodoPago?.code === payment.metodoPago?.code);

      if (paymentExists) {
        this.notification.push({
          message: 'La forma de pago ya está registrada. Elimínala y vuelve a intentarlo.',
          type: 'error',
        });
        return methods; // Retornamos la lista sin modificarla
      }

      // ✅ Calculamos el total incluyendo el nuevo pago
      const valorTotal =
        methods.reduce((acc, method) => acc + Number(method.valor || 0), 0) + Number(payment.valor || 0);

      const totalFactura = Number(this.calculateTotal()) || 0; // Aseguramos que sea un número válido

      if (valorTotal > totalFactura) {
        this.notification.push({
          message: 'El valor total de los pagos no puede ser mayor al total de la factura.',
          type: 'error',
        });
        return methods; // Retornamos la lista sin modificarla
      }

      // ✅ Si todo está correcto, agregamos el nuevo pago
      this.config.selectedPaymentMethod.set([...methods, payment]);
      return [...methods, payment]; // Retornamos la lista con el nuevo pago agregado
    });
  }
  removePayment(code: string): void {
    // Obtenemos la lista actual de métodos de pago
    this.paymentMethods.update((currentPaymentMethods = []) => {
      // Filtramos los métodos de pago para eliminar el que coincida con el código
      const updatedPaymentMethods = currentPaymentMethods.filter((method: any) => method.metodoPago?.code !== code);

      // Actualizamos los métodos de pago seleccionados
      this.config.selectedPaymentMethod.set(updatedPaymentMethods);

      return updatedPaymentMethods;
    });
  }
}
