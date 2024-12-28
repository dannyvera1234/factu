import { CurrencyPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { ModalComponent } from '@/components';
import { CreateProductoComponent } from '../create-producto';
import { CountersService } from '@/services/counters.service';
import { finalize, mergeMap, of } from 'rxjs';
import { AllListsProduct, GeneriResp } from '@/interfaces';
import { TextInitialsPipe } from '@/pipes';
import { DeleteProductComponent } from '../delete-product';

@Component({
  selector: 'app-list-inventario',
  imports: [
    NgOptimizedImage,
    ModalComponent,
    CreateProductoComponent,
    TextInitialsPipe,
    NgClass,
    CurrencyPipe,
    DeleteProductComponent,
  ],
  templateUrl: './list-inventario.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListInventarioComponent {
  @Input({ required: true }) set idePersonaRol(value: number) {
    this.getListProducts(value);
    this.personaRol.set(value);
  }

  public readonly personaRol= signal<number>(0);

  public readonly loading = signal(false);

  public readonly viewingIdProduct = signal<number | null>(null);

  public readonly listProducts = signal<GeneriResp<AllListsProduct[]> | null>(null);

  constructor(private readonly counterServicer: CountersService) {}

  getListProducts(idePersonaRol: number): void {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.counterServicer.allListProducts(idePersonaRol)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          console.log(resp);
          this.listProducts.set(resp);
        }
      });
  }

  deleteProducto(ideProduct: number): void {
    const currentCliente = this.listProducts();

    if (currentCliente) {
      const updatedCliente = {
        ...currentCliente,
        data: currentCliente.data.filter((cliente) => cliente.ide !== ideProduct),
      };

      this.listProducts.set(updatedCliente);
    }
  }

  createProduct(create:any): void {
    const currentCliente = this.listProducts();

    if (currentCliente) {
      const updatedCliente = {
        ...currentCliente,
        data: [...currentCliente.data, create],
      };

      this.listProducts.set(updatedCliente);
    }
  }
}
