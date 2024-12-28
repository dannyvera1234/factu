import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { finalize, mergeMap, of } from 'rxjs';
import { CountersService } from '@/services/counters.service';

@Component({
  selector: 'app-delete-application',
  imports: [],
  templateUrl: './delete-application.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteApplicationComponent {
  @Input({ required: true }) public idePersonaRol!: number;
  public readonly loading = signal(false);

  @Output() public readonly deleted = new EventEmitter<number |null>();

  constructor(private readonly counterService: CountersService) {}

  deleteApplication() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.counterService.deleteConterEmisor(this.idePersonaRol)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.deleted.emit(resp.data);
        }
      });
  }
}
