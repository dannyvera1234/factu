import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { of, mergeMap, finalize } from 'rxjs';
import { NotificationService } from '@/utils/services';
import { EmpresaService } from '@/services/service-empresas';

@Component({
  selector: 'app-delete-establecimiento',
  imports: [],
  templateUrl: './delete-establecimiento.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteEstablecimientoComponent {
  @Input({ required: true }) public ideRegister!: number;

  public readonly loading = signal(false);

  @Output() public readonly deleted = new EventEmitter<number | null>();

  constructor(
    private readonly emisorService: EmpresaService,
    private readonly notification: NotificationService,
  ) {}

  deleteEstablecimiento() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.emisorService.deleteSubsidiary(this.ideRegister)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.notification.push({
            message: 'Establecimiento eliminado del registro.',
            type: 'success',
          });
          this.deleted.emit(Number(resp.data));
        }
      });
  }
}
