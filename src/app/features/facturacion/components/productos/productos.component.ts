import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-productos',
  imports: [CommonModule],
  templateUrl: './productos.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductosComponent {
  products = signal<any[]>([]);
  isProductModalOpen = signal(false);
  addProduct(product: any) {
    this.products.update(currentProducts => {
      const existingProduct = currentProducts.find(p => p.id === product.id);
      if (existingProduct) {
        return currentProducts.map(p =>
          p.id === product.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      } else {
        return [...currentProducts, { ...product, cantidad: 1 }];
      }
    });
    this.isProductModalOpen.set(false);
  }

  removeProduct(id: number) {
    this.products.update(currentProducts => currentProducts.filter(product => product.id !== id));
  }

  updateProduct(id: number, field: keyof any, value: number | string) {
    this.products.update(currentProducts =>
      currentProducts.map(product => {
        if (product.id === id) {
          const updatedProduct = { ...product, [field]: typeof value === 'string' ? parseFloat(value) : value };
          updatedProduct.valorTotal = this.calculateProductTotal(updatedProduct);
          return updatedProduct;
        }
        return product;
      })
    );
  }

  calculateProductTotal(product: any): number {
      const subtotal = product.cantidad * product.precioUnitario;
      const discountAmount = subtotal * (product.descuento / 100);
      return subtotal - discountAmount + product.valorIce;
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
}
