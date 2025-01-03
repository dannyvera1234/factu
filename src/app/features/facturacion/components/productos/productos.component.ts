import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CreateFacturacionService } from '../../create-facturacion.service';
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

  constructor(private config: CreateFacturacionService) {}

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
    this.config.products.set([...this.products()]);
  }
  removeProduct(id: number) {
    this.products.update((currentProducts) => currentProducts.filter((product) => product.ide !== id));
  }
}
