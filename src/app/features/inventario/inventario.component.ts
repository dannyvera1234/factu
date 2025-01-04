import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-inventario',
  imports: [NgOptimizedImage],
  templateUrl: './inventario.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventarioComponent {

}
