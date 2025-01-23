import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { of, mergeMap, finalize } from 'rxjs';
import { CountersService } from '@/services/counters.service';
import { NotificationService } from '@/utils/services';

@Component({
  selector: 'app-delete-establecimiento',
  imports: [],
  templateUrl: './delete-establecimiento.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteEstablecimientoComponent {
@Input({ required: true }) public ide!: number;

public readonly loading = signal(false);

@Output() public readonly deleted = new EventEmitter<number |null>();

constructor(private readonly counterService: CountersService,
private readonly notification: NotificationService) {}


deleteEstablecimiento() {
  of(this.loading.set(true))
    .pipe(
      mergeMap(() => this.counterService.deleteEstablecimiento(this.ide)),
      finalize(() => this.loading.set(false)),
    )
    .subscribe((resp) => {
      if (resp.status === 'OK') {
        this.notification.push({
          message: 'Establecimiento eliminado del registro.',
          type: 'success',
        });
        this.deleted.emit(
          Number(resp.data)
        );
      }
    });
}
}
