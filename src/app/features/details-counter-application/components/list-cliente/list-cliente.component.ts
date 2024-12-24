import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ModalComponent } from '@/components';
import { NgOptimizedImage } from '@angular/common';
import { finalize, mergeMap, of } from 'rxjs';
import { CountersService } from '@/services/counters.service';

@Component({
  selector: 'app-list-cliente',
  imports: [ModalComponent, NgOptimizedImage],
  templateUrl: './list-cliente.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListClienteComponent {
  public readonly loading = signal(false);

  constructor(private readonly counterService: CountersService) {
    this.getListClientes();
  }

  getListClientes() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.counterService.getListClientes()),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((clientes) => {
        console.log(clientes);
      });
  }
}
