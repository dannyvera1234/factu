import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { of, mergeMap, finalize, timeout } from 'rxjs';
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
        finalize(() => {
          setTimeout(() => {
            this.loading.set(false);
            this.facturarProforma.emit(this.idsInvoices);
          }, 1000); // Retraso de 1 segundo
        }),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.notification.push({
            message: resp.message,
            type: 'success',
          });
        }
      });
  }
}
