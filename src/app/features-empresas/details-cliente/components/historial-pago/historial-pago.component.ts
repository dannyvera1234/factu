import { CurrencyPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output, signal } from '@angular/core';
import { CustomPipe } from '@/pipes';
import { ModalComponent } from '@/components';
import { UpdatePagoComponent } from './components';

@Component({
  selector: 'app-historial-pago',
  imports: [CurrencyPipe, NgClass, CustomPipe, NgOptimizedImage, ModalComponent, UpdatePagoComponent],
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

  public readonly updatePago = signal<any | null>(null);

  @Output() public readonly created = new EventEmitter<any | null>();

  constructor() {}

  toggleMenu(ide: number): void {
    // Si el elemento ya está seleccionado, deseleccionamos, si no, lo seleccionamos.
    this.selectedRow.set(this.selectedRow() === ide ? null : ide);
  }

  updateLetterPay(item: any) {
    if (!item) return;
    this.created.emit(item);
    // if (this.loadingShow) return;

    // this.historialPago = {
    //   ...this.historialPago,
    //   data: this.historialPago.data.map((entry: any) => {
    //     return entry.ide === item.letterPayIde ? { ...entry, paymentStatus: item.paymentStatus } : entry;
    //   }),
    // };
  }
}
