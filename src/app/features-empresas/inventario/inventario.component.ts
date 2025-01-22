import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ModalComponent } from '../../components';
import { CurrencyPipe, NgClass } from '@angular/common';
import { TextInitialsPipe } from '../../pipes';
import { GeneriResp } from '../../interfaces';

@Component({
  selector: 'app-inventario',
  imports: [ModalComponent, CurrencyPipe, NgClass, TextInitialsPipe],
  templateUrl: './inventario.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventarioComponent {
  public readonly loading = signal(false);

  public readonly listProducts = signal<GeneriResp<any[]> | null>(null);
}
