import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { of, mergeMap, finalize } from 'rxjs';
import { ListClientes, GeneriResp } from '@/interfaces';
import { ModalComponent } from '@/components';
import { FormatPhonePipe, TextInitialsPipe } from '@/pipes';
import { NgOptimizedImage } from '@angular/common';
import { ClientesService } from '@/services/service-empresas';
import {
  CreateClienteEmpresaComponent,
  DeleteClienteEmpresaComponent,
  UpdateClienteEmpresaComponent,
} from './components';
import { PaginationComponent } from '@/components/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-clientes-empresa',
  imports: [
    ModalComponent,
    FormatPhonePipe,
    TextInitialsPipe,
    NgOptimizedImage,
    CreateClienteEmpresaComponent,
    DeleteClienteEmpresaComponent,
    UpdateClienteEmpresaComponent,
    PaginationComponent,
    FormsModule,
  ],
  templateUrl: './lista-clientes-empresa.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaClientesEmpresaComponent {
  public readonly loading = signal(false);

  public readonly updateClient = signal<ListClientes | null>(null);

  public readonly idePersona = signal<number>(0);

  public readonly listClientes = signal<GeneriResp<any> | null>(null);

  public readonly viewingIdeCustomer = signal<number | null>(null);

  searchQuery = '';

  constructor(private readonly clienteService: ClientesService) {
    this.getListClientes();
  }

  onSearchClick(): void {
    // Si el término de búsqueda está vacío, puedes manejarlo de alguna manera, como mostrar un mensaje de error.
    if (this.searchQuery.trim()) {
      this.getListClientes(0, this.searchQuery); // Realiza la búsqueda desde la primera página
    } else {
      this.getListClientes();
    }
  }

  getListClientes(page: number = 0, searchTerm: string = ''): void {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.clienteService.listClientes(page, searchTerm)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.listClientes.set(resp);
        }
      });
  }

  onPageChange(newPage: number): void {
    const pagination = this.listClientes()?.data?.page;

    if (pagination) {
      pagination.currentPage = newPage;

      // Lógica adicional para manejar hasNext y hasPrevious
      pagination.hasNext = newPage < pagination.totalPages;
      pagination.hasPrevious = newPage > 1;

      this.getListClientes(newPage);
      // Aquí puedes realizar acciones adicionales, como cargar datos desde un servidor
    }
  }

  createCliente(create: ListClientes): void {
    const currentCliente = this.listClientes();

    if (!currentCliente?.data?.listData) return;

    const updatedCliente = {
      ...currentCliente,
      data: {
        ...currentCliente.data,
        listData: [...currentCliente.data.listData, create],
      },
    };

    this.listClientes.set(updatedCliente);
  }

  deleteCliente(ideCustomer: number): void {
    const currentCliente = this.listClientes();

    if (!currentCliente?.data?.listData) return;

    const updatedCliente = {
      ...currentCliente,
      data: {
        ...currentCliente.data,
        listData: currentCliente!.data!.listData!.filter((cliente: any) => cliente.ideCustomer !== ideCustomer),
      },
    };

    this.listClientes.set(updatedCliente);
  }

  updateCliente(update: Partial<ListClientes>): void {
    const currentCliente = this.listClientes();

    if (!currentCliente?.data?.listData) return;

    const updatedCliente = {
      ...currentCliente,
      data: {
        ...currentCliente.data,
        listData: currentCliente.data.listData.map((cliente: any) =>
          cliente.ideCustomer === update.ideCustomer ? update : cliente,
        ),
      },
    };

    this.listClientes.set(updatedCliente);
  }
}
