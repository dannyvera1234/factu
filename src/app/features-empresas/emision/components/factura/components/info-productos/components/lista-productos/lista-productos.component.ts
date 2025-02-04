import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { GeneriResp } from '@/interfaces';
import { NgClass, CurrencyPipe } from '@angular/common';
import { TextInitialsPipe } from '@/pipes';
import { DocumentosService } from '@/services/service-empresas';
import { NotificationService } from '@/utils/services';
import { PaginationComponent } from '../../../../../../../../components/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-productos',
  imports: [NgClass, CurrencyPipe, TextInitialsPipe, PaginationComponent, FormsModule],
  templateUrl: './lista-productos.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaProductosComponent {
  @Input({required: true}) set setPersonaRol(value: any) {
    if (value !== null) {
      this.listProductos(value);
      this.idePersonal.set(value);
    }
  }
  public readonly idePersonal = signal<number | null>(null);

  public readonly listProducts = signal<GeneriResp<any> | null>(null);

  @Output() public readonly addProducto = new EventEmitter<any | null>();

  searchQuery = '';

  constructor(
    private readonly facturacionService: DocumentosService,
    private readonly notification: NotificationService,
  ) {}

  listProductos(emisor: number, search: string = '', page: number = 0): void {
    this.facturacionService.listProduct(emisor, search, page).subscribe((resp) => {
      if (resp.status === 'OK') {
        console.log(resp);
        this.listProducts.set(resp);
      }
    });
  }

  onSearchClick(): void {
    console.log(this.searchQuery);
    console.log(this.idePersonal());
    // Si el término de búsqueda está vacío, puedes manejarlo de alguna manera, como mostrar un mensaje de error.
    if (this.searchQuery.trim()) {
      this.listProductos(this.idePersonal()!, this.searchQuery, 0); // Realiza la búsqueda desde la primera página
    } else {
      this.listProductos(this.idePersonal()!);
    }
  }

  onPageChange(newPage: number): void {
    const pagination = this.listProducts()?.data?.page;

    if (pagination) {
      pagination.currentPage = newPage;

      // Lógica adicional para manejar hasNext y hasPrevious
      pagination.hasNext = newPage < pagination.totalPages;
      pagination.hasPrevious = newPage > 1;

      this.listProductos(newPage);
      // Aquí puedes realizar acciones adicionales, como cargar datos desde un servidor
    }
  }

  addProduct(product: any) {
    if (product !== null) {
      this.addProducto.emit(product);
      this.notification.push({
        message: 'Productos cargados correctamente',
        type: 'success',
      });
    }
  }
}
