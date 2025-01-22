import { DetailsService } from './../../details.service';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CountersService } from '@/services/counters.service';
import { finalize, mergeMap, of } from 'rxjs';
import { NotificationService } from '@/utils/services';

@Component({
  selector: 'app-delete-product',
  imports: [],
  templateUrl: './delete-product.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteProductComponent {
  @Input({ required: true }) ideProduct!: number;

  @Input({ required: true }) personaRolIde!: number;

  public readonly loading = signal(false);

  @Output() public readonly deleted = new EventEmitter<number | null>();

  constructor(
    private readonly counterService: CountersService,
    private readonly notification: NotificationService,
    private readonly detailsService: DetailsService,
  ) {}

  deleteProduct(): void {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.counterService.deleteProduct(this.ideProduct)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.notification.push({
            message: 'Producto eliminado del registro.',
            type: 'success',
          });

          this.detailsService.info.set({
            personaRolIde: this.personaRolIde,
          });
          this.deleted.emit(Number(resp.data));
        }
      });
  }
}
