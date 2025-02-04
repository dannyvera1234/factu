import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { of, mergeMap, finalize } from 'rxjs';
import { DocumentosService } from '@/services/service-empresas';
import { NotificationService } from '@/utils/services';

@Component({
  selector: 'app-delete-factura',
  imports: [],
  templateUrl: './delete-factura.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteFacturaComponent {
@Input({ required: true }) public ideFactura!: number;
  public readonly loading = signal(false);

  @Output() public readonly deleted = new EventEmitter<number | null>();

  constructor(
    private readonly docService: DocumentosService,
    private readonly notification: NotificationService,
  ) {}

  deleteProforma() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.docService.deleteInvoice(this.ideFactura)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((res) => {
        if (res.status === 'OK') {
          this.deleted.emit(res.data);
          this.notification.push({
            message: 'Factura eliminada correctamente',
            type: 'success',
          });
        }
      });
  }
}
