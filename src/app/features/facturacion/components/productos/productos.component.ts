import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CreateFacturacionService } from '../../create-facturacion.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { FacturacionService } from '../../../../services';
import { GeneriResp } from '../../../../interfaces';
import { ListProductComponent } from './components';
import { ModalComponent } from '../../../../components';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, ListProductComponent, ModalComponent, NgOptimizedImage, FormsModule],
  templateUrl: './productos.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductosComponent {
  // products = signal<any[]>([]);
  isProductModalOpen = signal(false);
  // addProduct(product: any) {
  //   this.products.update((currentProducts) => {
  //     const existingProduct = currentProducts.find((p) => p.id === product.id);
  //     if (existingProduct) {
  //       return currentProducts.map((p) => (p.id === product.id ? { ...p, cantidad: p.cantidad + 1 } : p));
  //     } else {
  //       return [...currentProducts, { ...product, cantidad: 1 }];
  //     }
  //   });
  //   this.isProductModalOpen.set(false);
  // }



  updateProduct(id: number, field: keyof any, value: number | string) {
    this.products.update((currentProducts) =>
      currentProducts.map((product) => {
        if (product.id === id) {
          const updatedProduct = { ...product, [field]: typeof value === 'string' ? parseFloat(value) : value };
          updatedProduct.valorTotal = this.calculateProductTotal(updatedProduct);
          return updatedProduct;
        }
        return product;
      }),
    );
  }

  calculateProductTotal(product: any): number {
    const subtotal = product.stock * product.unitPrice;
    // const discountAmount = subtotal * (product.descuento / 100);
    return subtotal;
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

  public readonly products = signal<any[]>([]);

  addProducto(product: any) {

    this.products.update((currentProducts) => {
      const existingProduct = currentProducts.find((p) => p.ide === product.ide);
      if (existingProduct) {
        return currentProducts.map((p) => (p.ide === product.ide ? { ...p, stock: p.stock + 1 } : p));
      } else {
        return [...currentProducts, { ...product, stock: 1 }];
      }
    });
  }
  removeProduct(id: number) {
    this.products.update((currentProducts) => currentProducts.filter((product) => product.ide !== id));
  }


}
