import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { of, mergeMap, finalize } from 'rxjs';
import { GeneriResp, PersonData } from '@/interfaces';
import { CountersService } from '@/services/counters.service';
import { ModalComponent } from '@/components';
import { RouterLink } from '@angular/router';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { FormatPhonePipe, TextInitialsPipe } from '@/pipes';
import { CreateCounterComponent, DeleteCounterComponent } from './components';

@Component({
  selector: 'app-perfil-contador',
  imports: [
    ModalComponent,
    RouterLink,
    NgClass,
    TextInitialsPipe,
    FormatPhonePipe,
    DeleteCounterComponent,
    CreateCounterComponent,
    NgOptimizedImage,
  ],
  templateUrl: './perfil-contador.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerfilContadorComponent {
  public readonly loading = signal(false);

  public readonly counters = signal<GeneriResp<PersonData[]> | null>(null);

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
      .subscribe((response) => {
        if (response.status === 'OK') {
          this.counters.set(response);
        }
      });
  }

  deletePerfil(idePersona: number) {
    const idePerosonaRol = Number(idePersona);
    this.counters()!.data = this.counters()!.data.filter((item) => item.idePersonaRol !== idePerosonaRol);
  }

  updateCounter(data: PersonData) {
    const perfilesData = this.counters();
    if (perfilesData && perfilesData.data) {
      const updatedData = [...perfilesData.data, data];

      this.counters.set({
        ...perfilesData,
        data: updatedData,
      });
    }

    this.getListCounters();
  }
}
