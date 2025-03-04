import { ChangeDetectionStrategy, Component, computed, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateFacturaEmpresaService } from '../../create-factura-empresa.service';
import { NotificationService } from '../../../../../../utils/services';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-info-productos',
  imports: [
    CommonModule,
    FormsModule,
    Button,
  ],
  templateUrl: './info-productos.component.html',
  styles: `
    input[type='number'] {
      appearance: textfield;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoProductosComponent {
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

  @Input({ required: true }) set producto(product: any) {
    if (!product) return;
    this.addProducto(product);
    this.config.infoProducto.set(null);
  }

  public readonly calculateTotal = computed(() => {
    return this.config
      .detailProducts()
      ?.map((product) => ({ ...product }))
      .reduce((acc, product) => acc + product.valorTotal, 0);
  });

  public readonly paymentMethods = signal<any | null>(null);
  public readonly idePersona = signal<number | null>(null);
  public readonly products = signal<any[]>([]);
  public readonly Math = Math;

  constructor(
    public config: CreateFacturaEmpresaService,
    private readonly notification: NotificationService,
  ) {}

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
      type: 'warning',
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
    const allowedKeys = ['ArrowUp', 'ArrowDown', 'Backspace', 'Tab'];

    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
}
