import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CountersService } from '@/services/counters.service';
import { finalize, mergeMap, of } from 'rxjs';

@Component({
  selector: 'app-delete-product',
  imports: [],
  templateUrl: './delete-product.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteProductComponent {
  @Input({ required: true }) ideProduct!: number;

  public readonly loading = signal(false);

  @Output() public readonly deleted = new EventEmitter<number | null>();

  constructor(private readonly counterService: CountersService) {}

  deleteProduct(): void {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.counterService.deleteProduct(this.ideProduct)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.deleted.emit(Number(resp.data));
        }
      });
  }
}
