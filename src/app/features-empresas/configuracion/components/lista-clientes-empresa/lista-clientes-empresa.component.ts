import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { of, mergeMap, finalize } from 'rxjs';
import { ListClientes, GeneriResp } from '@/interfaces';
import { ModalComponent } from '@/components';
import { FormatPhonePipe, FormatIdPipe, TextInitialsPipe } from '@/pipes';
import { NgOptimizedImage } from '@angular/common';
import { ClientesService } from '@/services/service-empresas';
import { CreateClienteEmpresaComponent, DeleteClienteEmpresaComponent, UpdateClienteEmpresaComponent } from './components';

@Component({
  selector: 'app-lista-clientes-empresa',
  imports: [
    ModalComponent,
    FormatPhonePipe,
    FormatIdPipe,
    TextInitialsPipe,
    NgOptimizedImage,
    CreateClienteEmpresaComponent,
    DeleteClienteEmpresaComponent,
    UpdateClienteEmpresaComponent,
  ],
  templateUrl: './lista-clientes-empresa.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaClientesEmpresaComponent {
  public readonly loading = signal(false);

  public readonly updateClient = signal<ListClientes | null>(null);

  public readonly idePersona = signal<number>(0);

  public readonly listClientes = signal<GeneriResp<ListClientes[]> | null>(null);

  public readonly viewingIdeCustomer = signal<number | null>(null);

  constructor(private readonly clienteService: ClientesService) {
    this.getListClientes();
  }

  getListClientes() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.clienteService.listClientes()),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.listClientes.set(resp);
        }
      });
  }

  createCliente(create: ListClientes) {
    const currentCliente = this.listClientes();

    if (currentCliente) {
      const updatedCliente = {
        ...currentCliente,
        data: [...currentCliente.data, create],
      };

      this.listClientes.set(updatedCliente);
    }
  }

  deleteCliente(ideCustomer: number) {
    const currentCliente = this.listClientes();

    if (currentCliente) {
      const updatedCliente = {
        ...currentCliente,
        data: currentCliente.data.filter((cliente) => cliente.ideCustomer !== ideCustomer),
      };

      this.listClientes.set(updatedCliente);
    }
  }

  updateCliente(update: any) {
    const currentCliente = this.listClientes();

    if (currentCliente) {
      const updatedCliente = {
        ...currentCliente,
        data: currentCliente.data.map((cliente) => {
          if (cliente.ideCustomer === update.ideCustomer) {
            return update;
          }

          return cliente;
        }),
      };

      this.listClientes.set(updatedCliente);
    }
  }
}
