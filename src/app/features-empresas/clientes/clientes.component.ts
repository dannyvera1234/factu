import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { of, mergeMap, finalize } from 'rxjs';
import { ModalComponent } from '@/components';
import { PaginationComponent } from '@/components/pagination';
import { ListClientes, GeneriResp } from '@/interfaces';
import { FormatPhonePipe, TextInitialsPipe } from '@/pipes';
import { ClientesService } from '../../services/service-empresas';

import { RouterLink } from '@angular/router';
import { CreateClienteEmpresaComponent, DeleteClienteEmpresaComponent } from './components';

@Component({
  selector: 'app-clientes',
  imports: [
    ModalComponent,
    FormatPhonePipe,
    TextInitialsPipe,
    NgOptimizedImage,
    CreateClienteEmpresaComponent,
    DeleteClienteEmpresaComponent,
    PaginationComponent,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './clientes.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientesComponent {
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
    if (create) {
      this.getListClientes();
    }
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


}
