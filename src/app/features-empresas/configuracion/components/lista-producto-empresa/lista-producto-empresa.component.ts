import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ModalComponent } from '@/components';
import { of, mergeMap, finalize } from 'rxjs';
import { AllListsProduct, GeneriResp } from '@/interfaces';
import { CurrencyPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { TextInitialsPipe } from '@/pipes';
import {
  CreateProductoEmpresaComponent,
  DeleteProductoEmpresaComponent,
  UpdateProductoEmpresaComponent,
} from './components';
import { InventarioService } from '@/services/service-empresas';

@Component({
  selector: 'app-lista-producto-empresa',
  imports: [
    ModalComponent,
    NgClass,
    TextInitialsPipe,
    CurrencyPipe,
    NgOptimizedImage,
    CreateProductoEmpresaComponent,
    DeleteProductoEmpresaComponent,
    UpdateProductoEmpresaComponent,
  ],
  templateUrl: './lista-producto-empresa.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaProductoEmpresaComponent {
  public readonly personaRol = signal<number>(0);

  public readonly loading = signal(false);

  public readonly viewingIdProduct = signal<number | null>(null);

  public readonly viewingProduct = signal<AllListsProduct | null>(null);

  public readonly listProducts = signal<GeneriResp<AllListsProduct[]> | null>(null);

  constructor(private readonly inventarioService: InventarioService) {
    this.getListProducts();
  }

  getListProducts(): void {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.inventarioService.listoProducto()),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
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

  createProduct(create: any): void {
    const currentCliente = this.listProducts();

    if (currentCliente) {
      const updatedCliente = {
        ...currentCliente,
        data: [...currentCliente.data, create],
      };

      this.listProducts.set(updatedCliente);
    }
  }

  updateProduct(update: any): void {
    const currentCliente = this.listProducts();

    if (currentCliente) {
      const updatedCliente = {
        ...currentCliente,
        data: currentCliente.data.map((cliente) => {
          if (cliente.ide === update.ide) {
            return update;
          }

          return cliente;
        }),
      };

      this.listProducts.set(updatedCliente);
    }
  }
}
