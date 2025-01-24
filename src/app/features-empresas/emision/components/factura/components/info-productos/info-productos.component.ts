import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '@/components';
import { ListaProductosComponent } from './components';
import { CreateFacturaEmpresaService } from '../../create-factura-empresa.service';

@Component({
  selector: 'app-info-productos',
  imports: [CommonModule, ModalComponent, NgOptimizedImage, FormsModule, ListaProductosComponent],
  templateUrl: './info-productos.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoProductosComponent {
  constructor(private config: CreateFacturaEmpresaService) {}

  public readonly products = signal<any[]>([]);

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

    this.config.products.set([...this.products()]);
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
}
