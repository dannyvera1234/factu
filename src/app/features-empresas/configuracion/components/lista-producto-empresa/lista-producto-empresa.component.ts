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
import { PaginationComponent } from '@/components/pagination';
import { FormsModule } from '@angular/forms';

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
    PaginationComponent,
    FormsModule,
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

  public readonly listProducts = signal<GeneriResp<any> | null>(null);

  searchQuery = '';

  constructor(private readonly inventarioService: InventarioService) {
    this.getListProducts();
  }

  onSearchClick(): void {
    // Si el término de búsqueda está vacío, puedes manejarlo de alguna manera, como mostrar un mensaje de error.
    if (this.searchQuery.trim()) {
      this.getListProducts(0, this.searchQuery); // Realiza la búsqueda desde la primera página
    } else {
      this.getListProducts();
    }
  }

  getListProducts(page: number = 0, searchTerm: string = ''): void {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.inventarioService.listoProducto(page, searchTerm)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.listProducts.set(resp);
        }
      });
  }

  onPageChange(newPage: number): void {
    const pagination = this.listProducts()?.data?.page;

    if (pagination) {
      pagination.currentPage = newPage;

      // Lógica adicional para manejar hasNext y hasPrevious
      pagination.hasNext = newPage < pagination.totalPages;
      pagination.hasPrevious = newPage > 1;

      this.getListProducts(newPage);
      // Aquí puedes realizar acciones adicionales, como cargar datos desde un servidor
    }
  }

  deleteProducto(ideProduct: number): void {
    const currentCliente = this.listProducts();
    if (!currentCliente?.data?.listData) return;

    const updatedCliente = {
      ...currentCliente.data,
      data: {
        ...currentCliente.data,
        listData: currentCliente!.data!.listData!.filter((cliente: any) => cliente.ide !== ideProduct),
      },
    };

    this.listProducts.set(updatedCliente);
  }

  createProduct(create: any): void {
    const currentCliente = this.listProducts();

    if (!currentCliente?.data?.listData) return;

    const updatedCliente = {
      ...currentCliente,
      data: {
        ...currentCliente.data,
        listData: [...currentCliente.data.listData, create],
      },
    };

    this.listProducts.set(updatedCliente);
  }

  updateProduct(update: any): void {
    const currentCliente = this.listProducts();

    if (!currentCliente?.data?.listData) return;

    const updatedCliente = {
      ...currentCliente,
      data: {
        ...currentCliente.data,
        listData: currentCliente.data.listData.map((cliente: any) => (cliente.ide === update.ide ? update : cliente)),
      },
    };

    this.listProducts.set(updatedCliente);
  }
}
