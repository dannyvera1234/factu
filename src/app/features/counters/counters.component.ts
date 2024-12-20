import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CountersService } from '../../services/counters.service';
import { ModalComponent } from '../../components';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { TextInitialsPipe } from '../../pipes';
import { finalize, mergeMap, of } from 'rxjs';
import { DeleteCounterComponent } from './components';
import { CreateCounterComponent } from "../create-counter/create-counter.component";

@Component({
  selector: 'app-counters',
  imports: [ModalComponent, NgClass, TextInitialsPipe, NgOptimizedImage, DeleteCounterComponent, CreateCounterComponent],
  templateUrl: './counters.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountersComponent {
  public readonly loading = signal(false);

  public readonly counters = signal<any | null>(null);

  public readonly viewing = signal<number | null>(null);

  constructor(private readonly counterService: CountersService) {
    this.getListCounters();
  }

  private getListCounters() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.counterService.getListCounters()),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((response) => this.counters.set(response));
  }
}
