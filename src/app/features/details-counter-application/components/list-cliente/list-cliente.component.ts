import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { ModalComponent } from '@/components';
import { NgOptimizedImage } from '@angular/common';
import { finalize, mergeMap, of } from 'rxjs';
import { CountersService } from '@/services/counters.service';
import { CreateClienteComponent } from '../create-cliente';
import { GeneriResp, ListClientes } from '@/interfaces';
import { TextInitialsPipe } from '../../../../pipes';
import { DeleteClienteComponent } from '../delete-cliente';

@Component({
  selector: 'app-list-cliente',
  imports: [ModalComponent, NgOptimizedImage, CreateClienteComponent, TextInitialsPipe, DeleteClienteComponent],
  templateUrl: './list-cliente.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListClienteComponent {
  @Input({ required: true }) set idePersonaRol(value: number) {
    this.getListClientes(value);
    this.idePersona.set(value);
  }

  public readonly loading = signal(false);

  public readonly idePersona = signal<number>(0);

  public readonly listClientes = signal<GeneriResp<ListClientes[]> | null>(null);

  public readonly viewingIdeCustomer = signal<number | null>(null);

  constructor(private readonly counterService: CountersService) {}

  getListClientes(idePersonaRol: number) {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.counterService.getListClientesCounter(idePersonaRol)),
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
}
