import { CurrencyPipe, NgClass, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CustomPipe } from '@/pipes';
import { ModalComponent } from '@/components';
import { HistorialCreditoComponent, UpdatePagoComponent } from './components';
import { finalize, mergeMap, of } from 'rxjs';
import { DocumentosService } from '@/services/service-empresas';
import { NotificationService } from '@/utils/services';

@Component({
  selector: 'app-historial-pago',
  imports: [
    CurrencyPipe,
    NgClass,
    CustomPipe,
    NgOptimizedImage,
    ModalComponent,
    UpdatePagoComponent,
    HistorialCreditoComponent,
  ],
  templateUrl: './historial-pago.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistorialPagoComponent {
  @Output() public readonly created = new EventEmitter<any | null>();
  @Input({ required: true }) loadingShow!: boolean;
  @Input({ required: true }) historialPago!: any;

  public readonly ideLetterPay = signal<number | null>(null);
  public readonly updatePago = signal<any | null>(null);

  public readonly pagosPagados = computed(
    () => this.historialPago.respHistoriaPago.data.filter((item: any) => item.paymentStatus === 'PAGADO').length,
  );

  public readonly pagosAtrasados = computed(
    () => this.historialPago.respHistoriaPago.data.filter((item: any) => item.paymentStatus === 'ATRASADO').length,
  );

  public readonly pagosPendientes = computed(
    () => this.historialPago.respHistoriaPago.data.filter((item: any) => item.paymentStatus === 'PENDIENTE').length,
  );



  constructor(
    private readonly docService: DocumentosService,
    private readonly notification: NotificationService,
  ) {}

  getPlural(count: number, word: string): string {
    return count === 1 ? word : word + 's';
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
          this.notification.push({
            message: 'Correo enviado correctamente',
            type: 'success',
          });
        }
      });
  }
}
