import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { of, mergeMap, finalize } from 'rxjs';
import { GeneriResp, ListClientes } from '../../interfaces';
import { ClientesService } from '../../services/service-empresas';
import { NgClass } from '@angular/common';
import {  FormatPhonePipe, TextInitialsPipe } from '../../pipes';
import { ModalComponent } from '../../components';
import { BuroCreditoComponent, ListaDocComponent, UpdateClienteEmpresaComponent } from './components';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-details-cliente',
  imports: [NgClass, FormatPhonePipe, ModalComponent, TextInitialsPipe, UpdateClienteEmpresaComponent, BuroCreditoComponent,ListaDocComponent, RouterLink],
  templateUrl: './details-cliente.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsClienteComponent {
  @Input({ required: true }) set ideCustomerEncrypted(value: string) {
    this.detailsCustomer(value);
  }

  public readonly loading = signal(false);

  public readonly customer = signal<GeneriResp<any> | null>(null);

  public readonly updateClient = signal<any | null>(null);

  constructor(private readonly clienteService: ClientesService) {}

  detailsCustomer(value: string) {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.clienteService.detailsCustomer(value)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.customer.set(resp);
        }
      });
  }

  updateCliente(update: Partial<ListClientes>): void {
    const currentCliente = this.customer();

    if (!currentCliente?.data?.infoPersonal) return;

    const updatedCliente = {
      ...currentCliente,
      data: {
        ...currentCliente.data,
        infoPersonal: {
          ...currentCliente.data.infoPersonal,
          ...(update.ideCustomer === currentCliente.data.infoPersonal.ideCustomer ? update : {}),
        },
      },
    };

    this.customer.set(updatedCliente);
  }
}
