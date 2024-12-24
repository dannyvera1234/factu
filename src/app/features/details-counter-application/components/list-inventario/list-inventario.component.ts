import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ModalComponent } from '@/components';

@Component({
  selector: 'app-list-inventario',
  imports: [NgOptimizedImage, ModalComponent],
  templateUrl: './list-inventario.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListInventarioComponent {

public readonly loading = signal(false);
}
