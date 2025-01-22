import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { of, mergeMap, finalize } from 'rxjs';
import { CountersService } from '@/services/counters.service';

@Component({
  selector: 'app-delete-counter',
  imports: [],
  templateUrl: './delete-counter.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteCounterComponent {
  @Input({ required: true }) public idePersonaRol!: number;

  public readonly loading = signal(false);

  @Output() public readonly deleted = new EventEmitter<null>();


   constructor(private readonly counterService: CountersService) {}

  deletePerfil() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.counterService.deleteCounter(this.idePersonaRol)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if(resp.status === 'OK') {
          this.deleted.emit(resp.data)
        }
      });
  }
}

