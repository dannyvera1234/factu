import { CurrencyPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Input, signal } from '@angular/core';
import { CustomPipe } from '@/pipes';
import { ModalComponent } from '../../../../components';

@Component({
  selector: 'app-historial-pago',
  imports: [CurrencyPipe, NgClass, CustomPipe, NgOptimizedImage, ModalComponent],
  templateUrl: './historial-pago.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistorialPagoComponent {
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    // Si el clic no es dentro de la tabla o el botón de configuración, cerramos el menú
    const menu = (event.target as HTMLElement).closest('.group');
    if (!menu) {
      this.selectedRow.set(null);
    }
  }

  @Input({ required: true }) loadingShow!: boolean;

  @Input({ required: true }) historialPago!: any;

  public readonly selectedRow = signal<number | null>(null);

  constructor() {}

  toggleMenu(ide: number) {
    if (this.selectedRow() === ide) {
      this.selectedRow.set(null);
    } else {
      this.selectedRow.set(ide);
    }
  }
}
