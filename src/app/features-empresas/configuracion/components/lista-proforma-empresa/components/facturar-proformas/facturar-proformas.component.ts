import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { of, mergeMap, finalize } from 'rxjs';
import { EmpresaService } from '../../../../../../services/service-empresas';
import { NotificationService } from '@/utils/services';

@Component({
  selector: 'app-facturar-proformas',
  imports: [],
  templateUrl: './facturar-proformas.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacturarProformasComponent {
 @Input({ required: true })  set ideProformas(value: any) {
   console.log(value);
 }

  public readonly loading = signal(false);

  @Output() public readonly facturarProforma = new EventEmitter<number | null>();

  constructor(
    private readonly emisorService: EmpresaService,
    private readonly notification: NotificationService,
  ) {}

  deleteDoc() {
    // of(this.loading.set(true))
    //   .pipe(
    //     mergeMap(() => this.emisorService.deleteFile(this.ideRegister)),
    //     finalize(() => this.loading.set(false)),
    //   )
    //   .subscribe((resp) => {
    //     if (resp.status === 'OK') {
    //       this.notification.push({
    //         message: 'Documento eliminado del registro.',
    //         type: 'success',
    //       });
    //       this.deleted.emit(Number(resp.data));
    //     }
    //   });
  }
}
