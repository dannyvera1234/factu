import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { finalize, mergeMap, of } from 'rxjs';
import { CountersService } from '@/services/counters.service';
import { NotificationService } from '@/utils/services';

@Component({
  selector: 'app-delete-logo',
  imports: [],
  templateUrl: './delete-logo.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteLogoComponent {
  @Input({ required: true }) idePersonaRol!: number;

  public readonly loading = signal(false);

  @Output() public readonly deleted = new EventEmitter<any | null>();

  constructor(
    private counterService: CountersService,
    private notification: NotificationService,
  ) {}

  deleteLogo() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.counterService.deleteLogo(this.idePersonaRol)),
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
