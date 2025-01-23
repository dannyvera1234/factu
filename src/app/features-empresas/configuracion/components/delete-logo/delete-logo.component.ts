import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';
import { of, mergeMap, finalize } from 'rxjs';
import { NotificationService } from '@/utils/services';
import { EmpresaService } from '@/services/service-empresas';

@Component({
  selector: 'app-delete-logo',
  imports: [],
  templateUrl: './delete-logo.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteLogoComponent {

  public readonly loading = signal(false);

  @Output() public readonly deleted = new EventEmitter<any | null>();

  constructor(
    private emisorService: EmpresaService,
    private notification: NotificationService,
  ) {}

  deleteLogo() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.emisorService.deleteLogo()),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.deleted.emit(resp);
          this.notification.push({
            message: 'Logo eliminado del registro.',
            type: 'success',
          });
        }
      });
  }
}
