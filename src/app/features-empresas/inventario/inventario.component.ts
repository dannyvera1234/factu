import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { ModalComponent } from '../../components';
import { of, mergeMap, finalize } from 'rxjs';
import { AllListsProduct, GeneriResp } from '../../interfaces';
import { InventarioService } from '../../services/service-empresas';
import { Modulos } from '../../utils/permissions';
import {
  CreateProductoEmpresaComponent,
  DeleteProductoEmpresaComponent,
  FilterComponent,
  UpdateProductoEmpresaComponent,
} from './components';

@Component({
  selector: 'app-inventario',
  imports: [
    ModalComponent,
    NgOptimizedImage,
    FormsModule,
    RouterLink,
    TableModule,
    ButtonModule,
    CreateProductoEmpresaComponent,
    DeleteProductoEmpresaComponent,
    UpdateProductoEmpresaComponent,
    FormsModule,
    Tag,
    CurrencyPipe,
    FilterComponent
  ],
  templateUrl: './inventario.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventarioComponent {
  public readonly open = signal<'nombre' | 'categoria' | null>(null);
  public readonly viewingProduct = signal<AllListsProduct[] | null>(null);
  public readonly listProducts = signal<GeneriResp<any> | null>(null);
  public readonly viewingIdProduct = signal<number | null>(null);
  public readonly filterProducts = signal<any | null>(null);
  public readonly numElementsByPage = signal<number>(0);
  public readonly personaRol = signal<number>(0);
  public readonly loading = signal(false);
  private size = Modulos.PAGE_SIZE;
  public searchQuery = '';
  private page = 0;

  constructor(private readonly inventarioService: InventarioService) {
    this.getListProducts();
  }

  toggleFilter(filterName: 'nombre' | 'categoria' | null) {
    if (this.open() === filterName) {
      this.open.set(null);
    } else {
      this.open.set(filterName);
    }
  }

  filter() {
    this.open.set(null);
    this.getListProducts();
  }

  onPageChange(newPage: any): void {
    console.log(newPage);
    this.page = newPage.first / newPage.rows;
    this.size = newPage.rows;
    this.getListProducts();
  }

  getListProducts(): void {
    const filter = {
      page: this.page,
      size: this.size,
      search: this.searchQuery,
    };
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.inventarioService.listoProducto(filter)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          console.log(resp);
          this.listProducts.set(resp);
          this.filterProducts.set(resp.data.page);
          this.numElementsByPage.set(resp.data.page.numElementsByPage);
        }
      });
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
