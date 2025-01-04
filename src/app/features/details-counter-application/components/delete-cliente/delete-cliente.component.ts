import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CountersService } from '@/services/counters.service';
import { of, mergeMap, finalize } from 'rxjs';
import { NotificationService } from '../../../../utils/services';

@Component({
  selector: 'app-delete-cliente',
  imports: [],
  templateUrl: './delete-cliente.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteClienteComponent {
  @Input({ required: true }) idePersonaRol!: number;

  public readonly loading = signal(false);

  @Output() public readonly deleted = new EventEmitter<number | null>();

  constructor(
    private readonly counterService: CountersService,
    private readonly notification: NotificationService,
  ) {}

  deleteClient() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.counterService.deleteClienteCounter(this.idePersonaRol)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.notification.push({
            message: 'Cliente eliminado del registro.',
            type: 'success',
          });
          this.deleted.emit(Number(resp.data));
        }
      });
  }
}
