import { CurrencyPipe, JsonPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output, signal } from '@angular/core';
import { CustomPipe } from '@/pipes';
import { ModalComponent, ViewerDocumentComponent } from '@/components';
import { UpdatePagoComponent } from './components';
import { finalize, mergeMap, of } from 'rxjs';
import { DocumentosService } from '../../../../services/service-empresas';
import { NotificationService } from '../../../../utils/services';

@Component({
  selector: 'app-historial-pago',
  imports: [
    CurrencyPipe,
    NgClass,
    CustomPipe,
    NgOptimizedImage,
    ModalComponent,
    UpdatePagoComponent,
    ViewerDocumentComponent,
  ],
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

  public readonly currentDocumentUrl = signal<string | null>(null);

  public readonly isModalOpen = signal(false);

  @Output() public readonly created = new EventEmitter<any | null>();

  constructor(
    private readonly docService: DocumentosService,
    private readonly notification: NotificationService,
  ) {}

  toggleMenu(ide: number): void {
    // Si el elemento ya está seleccionado, deseleccionamos, si no, lo seleccionamos.
    this.selectedRow.set(this.selectedRow() === ide ? null : ide);
  }

  openDocument(item: any) {
    this.currentDocumentUrl.set(item);
    this.isModalOpen.set(true);
    this.selectedRow.set(null);
  }

  closeDocument() {
    this.isModalOpen.set(false);
    this.currentDocumentUrl.set(null);
  }

  updateLetterPay(item: any) {
    if (!item) return;
    this.created.emit(item);
  }

  reeviarEmail(id: number) {
    of((this.loadingShow = true))
      .pipe(
        mergeMap(() => this.docService.letterPayNotification(id)),
        finalize(() => (this.loadingShow = false)),
      )
      .subscribe((res) => {
        if (res.status === 'OK') {
          this.selectedRow.set(null);
          this.notification.push({
            message: 'Correo enviado correctamente',
            type: 'success',
          });
        }
      });
  }
}
