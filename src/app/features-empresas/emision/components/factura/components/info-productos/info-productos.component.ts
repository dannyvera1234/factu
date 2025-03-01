import { ChangeDetectionStrategy, Component, computed, Input, signal, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '@/components';
import { AddPaymentComponent, ListaProductosComponent } from './components';
import { CreateFacturaEmpresaService } from '../../create-factura-empresa.service';
import { NotificationService } from '../../../../../../utils/services';

@Component({
  selector: 'app-info-productos',
  imports: [CommonModule, ModalComponent, NgOptimizedImage, FormsModule, ListaProductosComponent, AddPaymentComponent],
  templateUrl: './info-productos.component.html',
  styles: `
    input[type='number'] {
      appearance: textfield;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoProductosComponent {
  @Input({ required: true }) setPersonaRol!: any;

  @Input({ required: true }) set editProformaProducto(product: any[]) {
    if (product) {
      product.forEach((item: any) => {
        item.cantidad = item.amount;
        item.valorTotal = item.total;
        item.subTotal = item.subtotal;
        item.valorIVA = item.valueIva;
        item.ide = item.productIde;
        item.auxiliaryCode = item.auxilaryCode;
        this.products().push(item);
      });
      this.config.detailProducts.set([...this.products()]);
      this.config.products.set([...this.products()]);
    }
  }

  public readonly calculateTotal = computed(() => {
    return this.config
      .detailProducts()
      ?.map((product) => ({ ...product }))
      .reduce((acc, product) => acc + product.valorTotal, 0);
  });

  Math = Math;

  public readonly idePersona = signal<number | null>(null);

  public readonly paymentMethods = signal<any | null>(null);

  constructor(
    public config: CreateFacturaEmpresaService,
    private readonly notification: NotificationService,
  ) {}

  public readonly products = signal<any[]>([]);

  decrementCantidad(product: any): void {
    product.cantidad = Math.max(1, product.cantidad - 1);
    this.updateProduct(product); // Actualiza el producto al decrementar
  }

  incrementCantidad(product: any): void {
    product.cantidad = Math.min(product.availableStock, product.cantidad + 1);
    if (product.cantidad > product.availableStock) {
    }
    this.updateProduct(product); // Actualiza el producto al incrementar
  }

  addProducto(product: any) {
    this.products.update((currentProducts) => {
      const existingProduct = currentProducts.find((p) => p.ide === product.ide);

      if (existingProduct) {
        existingProduct.cantidad = existingProduct.cantidad += 1;
        existingProduct.valorIVA = (existingProduct.subTotal * existingProduct.tariffIva) / 100;
        existingProduct.subTotal = existingProduct.cantidad * existingProduct.unitPrice;
        existingProduct.valorTotal = existingProduct.subTotal + existingProduct.valorIVA;
        return currentProducts;
      } else {
        product.cantidad = 1;
        product.subTotal = product.cantidad * product.unitPrice;
        product.valorIVA = (product.cantidad * product.unitPrice * product.tariffIva) / 100;
        product.valorTotal = product.subTotal + product.valorIVA;

        return [...currentProducts, { ...product }];
      }
    });

    this.config.detailProducts.set([...this.products()]);
    this.config.products.set([...this.products()]);
  }

  removeProduct(id: number) {
    this.products.update((currentProducts) => currentProducts.filter((product) => product.ide !== id));
    this.config.detailProducts.set([...this.products()]);
    this.config.products.set([...this.products()]);

    this.notification.push({
      message: 'Producto eliminado correctamente',
      type: 'success',
    });
  }

  updateProduct(product: any) {
    // Verificar si la cantidad ingresada es mayor que el stock disponible
    if (product.cantidad > product.availableStock) {
      // Ajustar la cantidad al stock disponible
      product.cantidad = product.availableStock;
    }

    // Verificar si la cantidad ingresada es menor que 1
    if (product.cantidad < 1) {
      product.cantidad = 1; // Restablecer a 1 si la cantidad es menor a 1
    }

    // Recalcular el subTotal, IVA y Total con la cantidad actualizada
    product.subTotal = product.cantidad * product.unitPrice;
    product.valorIVA = (product.subTotal * product.tariffIva) / 100;
    product.valorTotal = product.subTotal + product.valorIVA;

    // Actualizar el producto en el array de productos
    this.products.update((currentProducts) => {
      const existingProduct = currentProducts.find((p) => p.ide === product.ide);

      if (existingProduct) {
        existingProduct.cantidad = product.cantidad;
        existingProduct.subTotal = product.subTotal;
        existingProduct.valorIVA = product.valorIVA;
        existingProduct.valorTotal = product.valorTotal;
      }
      return [...currentProducts];
    });
    this.config.detailProducts.set([...this.products()]);
    // Actualizar el estado global de productos
    this.config.products.set([...this.products()]);
  }

  restrictInput(event: KeyboardEvent) {
    // Permitir solo teclas de flecha (arriba y abajo) y retroceso
    const allowedKeys = ['ArrowUp', 'ArrowDown', 'Backspace', 'Tab'];

    if (!allowedKeys.includes(event.key)) {
      event.preventDefault(); // Bloquea cualquier otra tecla
    }
  }
  addPayment(payment: any): void {
    if (!payment) return;

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
      const valorTotal = methods.reduce((acc, method) => acc + Number(method.valor || 0), 0) + Number(payment.valor || 0);

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
