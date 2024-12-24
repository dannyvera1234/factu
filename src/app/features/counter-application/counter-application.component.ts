import { NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CountersService } from '../../services/counters.service';
import { finalize, mergeMap, of } from 'rxjs';
import { GeneriResp } from '@/interfaces';
import {  TextInitialsPipe } from '@/pipes';
import { ModalComponent } from '../../components';
import { DeleteApplicationComponent } from './components';

@Component({
  selector: 'app-counter-application',
  imports: [NgOptimizedImage, RouterLink, TextInitialsPipe, NgClass, ModalComponent, DeleteApplicationComponent],
  templateUrl: './counter-application.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterApplicationComponent {
  public readonly loading = signal(false);

  public readonly counterList = signal<GeneriResp<any[]> | null>(null);

    public readonly viewing = signal<number | null>(null);

  constructor(private readonly counterService: CountersService) {
    this.getListCounters();
  }

  getListCounters() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.counterService.getListCountersByEmisor()),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) =>
        this.counterList.set(resp));
  }
}
