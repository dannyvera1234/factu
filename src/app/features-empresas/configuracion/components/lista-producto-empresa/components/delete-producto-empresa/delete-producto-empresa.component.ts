import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { of, mergeMap, finalize } from 'rxjs';
import { NotificationService } from '@/utils/services';
import { InventarioService } from '@/services/service-empresas';
import { DetailsService } from '@/features/details-counter-application';

@Component({
  selector: 'app-delete-producto-empresa',
  imports: [],
  templateUrl: './delete-producto-empresa.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteProductoEmpresaComponent {
  @Input({ required: true }) ideProduct!: number;

  public readonly loading = signal(false);

  @Output() public readonly deleted = new EventEmitter<number | null>();

  constructor(
    private readonly notification: NotificationService,
    private readonly inventarioService: InventarioService,
    private readonly detailsService: DetailsService,
  ) {}

  deleteProduct(): void {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.inventarioService.deleteProduct(this.ideProduct)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.notification.push({
            message: 'Producto eliminado del registro.',
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
