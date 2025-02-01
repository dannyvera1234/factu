import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { of, mergeMap, finalize } from 'rxjs';
import { DocumentosService } from '@/services/service-empresas';
import { NotificationService } from '@/utils/services';

@Component({
  selector: 'app-facturar-proformas',
  imports: [],
  templateUrl: './facturar-proformas.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturarProformasComponent {
  @Input({ required: true }) idsInvoices!: any;

  public readonly loading = signal(false);

  @Output() public readonly facturarProforma = new EventEmitter<number | null>();

  constructor(
    private readonly docService: DocumentosService,
    private readonly notification: NotificationService,
  ) {}

  generateLoteProforma() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.docService.generateLoteProforma(this.idsInvoices)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          console.log(resp);
          this.notification.push({
            message: 'Proformas en lote generadas correctamente.',
            type: 'success',
          });
          this.facturarProforma.emit(this.idsInvoices);
        }
      });
  }
}
