import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { of, mergeMap, finalize } from 'rxjs';
import { DetailsService } from '@/features/details-counter-application';
import { NotificationService } from '@/utils/services';
import { ClientesService } from '@/services/service-empresas';

@Component({
  selector: 'app-delete-cliente-empresa',
  imports: [],
  templateUrl: './delete-cliente-empresa.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteClienteEmpresaComponent {
  @Input({ required: true }) ideCustomer!: number;

  public readonly loading = signal(false);

  @Output() public readonly deleted = new EventEmitter<number | null>();

  constructor(
    private readonly clienteService: ClientesService,
    private readonly notification: NotificationService,
    private readonly detailsService: DetailsService,
  ) {}

  deleteClient() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.clienteService.deleteCustomer(this.ideCustomer)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.notification.push({
            message: 'Cliente eliminado del registro.',
            type: 'success',
          });

          this.detailsService.info.set({
            personaRolIde: Number(resp.data),
          });
          this.deleted.emit(Number(resp.data));
        }
      });
  }
}
