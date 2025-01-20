import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { CurrencyPipe, NgClass } from '@angular/common';
import { CountersService } from '@/services/counters.service';
import { finalize, mergeMap, of } from 'rxjs';
import { GeneriResp } from '@/interfaces';
import { CustomDatePipe } from '@/pipes';
import { ConfigFacturacionService, NotificationService } from '@/utils/services';
import { PaginationComponent } from '../../../../components/pagination';

@Component({
  selector: 'app-doc-autorizados',
  imports: [CurrencyPipe, NgClass, CustomDatePipe, PaginationComponent],
  templateUrl: './doc-autorizados.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocAutorizadosComponent {
  @Input({ required: true }) set idePersonaRol(value: number) {
    this.getListInvoices(value, 0);
    this.idePersona.set(value);
  }

  public readonly idePersona = signal<number | null>(null);

  public readonly showTooltip = signal<{ [key: string]: boolean }>({});

  public readonly loading = signal(false);

  public readonly listInvoices = signal<GeneriResp<any> | null>(null);

  constructor(
    private readonly counterService: CountersService,
    public readonly config: ConfigFacturacionService,
    private readonly notification: NotificationService,
  ) {}

  toggleTooltip(id: number, isVisible: boolean): void {
    const currentState = this.showTooltip();
    this.showTooltip.set({ ...currentState, [id]: isVisible });
  }

  isTooltipVisible(id: number): boolean {
    return !!this.showTooltip()[id];
  }

  onSyncClick() {
    const idePersonaRol = this.idePersona();
    if (idePersonaRol) {
      this.getListInvoices(idePersonaRol, 0);
    }
  }

  onPageChange(newPage: number): void {
    const pagination = this.listInvoices()?.data?.page;
    const idePersonaRol = this.idePersona()!;

    if (pagination) {
      pagination.currentPage = newPage;

      // Lógica adicional para manejar hasNext y hasPrevious
      pagination.hasNext = newPage < pagination.totalPages;
      pagination.hasPrevious = newPage > 1;

      this.getListInvoices(idePersonaRol, newPage);
      // Aquí puedes realizar acciones adicionales, como cargar datos desde un servidor
    }
  }

  getListInvoices(idePersonaRol: number, page: number): void {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.counterService.getListInvoices(idePersonaRol, page)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((res) => {
        if (res.status === 'OK') {
          this.listInvoices.set(res);
        }
      });
  }

  reeviarEmail(id: number) {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.counterService.sendNotification(id)),
        finalize(() => this.loading.set(false)),
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
