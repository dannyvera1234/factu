import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ModalComponent } from '@/components';
import { FormatIdPipe, FormatPhonePipe, TextInitialsPipe } from '@/pipes';
import { of, mergeMap, finalize } from 'rxjs';
import { ListClientes, GeneriResp } from '@/interfaces';
import { ProveedorService } from '@/services/service-empresas';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-proveedores',
  imports: [ModalComponent, TextInitialsPipe, FormatIdPipe, FormatPhonePipe, NgOptimizedImage],
  templateUrl: './proveedores.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProveedoresComponent {
  public readonly loading = signal(false);

  public readonly updateClient = signal<ListClientes | null>(null);

  public readonly idePersona = signal<number>(0);

  public readonly listProveedor = signal<GeneriResp<ListClientes[]> | null>(null);

  public readonly viewingIdeCustomer = signal<number | null>(null);

  constructor(private readonly proveedorService: ProveedorService) {
    this.getListProveedor();
  }

  getListProveedor() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.proveedorService.listoProveedor()),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.listProveedor.set(resp);
        }
      });
  }

  createCliente(create: ListClientes) {
    const currentCliente = this.listProveedor();

    if (currentCliente) {
      const updatedCliente = {
        ...currentCliente,
        data: [...currentCliente.data, create],
      };

      this.listProveedor.set(updatedCliente);
    }
  }

  deleteCliente(ideCustomer: number) {
    const currentCliente = this.listProveedor();

    if (currentCliente) {
      const updatedCliente = {
        ...currentCliente,
        data: currentCliente.data.filter((cliente) => cliente.ideCustomer !== ideCustomer),
      };

      this.listProveedor.set(updatedCliente);
    }
  }

  updateCliente(update: any) {
    const currentCliente = this.listProveedor();

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

      this.listProveedor.set(updatedCliente);
    }
  }
}
