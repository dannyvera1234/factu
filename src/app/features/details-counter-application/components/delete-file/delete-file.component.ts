import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { finalize, mergeMap, of } from 'rxjs';
import { CountersService } from '@/services/counters.service';
import { NotificationService } from '@/utils/services';

@Component({
  selector: 'app-delete-file',
  imports: [],
  templateUrl: './delete-file.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteFileComponent {
@Input({ required: true }) public ide!: number;

public readonly loading = signal(false);

@Output() public readonly deleted = new EventEmitter<number |null>();

constructor(private readonly counterService: CountersService,
private readonly notification: NotificationService) {}


deleteDoc() {
  of(this.loading.set(true))
    .pipe(
      mergeMap(() => this.counterService.deleteDoc(this.ide)),
      finalize(() => this.loading.set(false)),
    )
    .subscribe((resp) => {
      if (resp.status === 'OK') {
        this.notification.push({
          message: 'Documento eliminado del registro.',
          type: 'success',
        });
        this.deleted.emit(
          Number(resp.data)
        );
      }
    });
}
}
