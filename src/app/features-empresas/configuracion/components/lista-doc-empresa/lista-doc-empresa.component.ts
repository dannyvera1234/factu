import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { of, mergeMap, finalize } from 'rxjs';
import { GeneriResp } from '@/interfaces';
import { ConfigFacturacionService, NotificationService } from '@/utils/services';
import { PaginationComponent } from '@/components/pagination';
import { CurrencyPipe, NgClass } from '@angular/common';
import { CustomDatePipe } from '@/pipes';
import { DocumentosService } from '@/services/service-empresas';
import { DetailsService } from '@/feature-counters/details-counter-application';

@Component({
  selector: 'app-lista-doc-empresa',
  imports: [PaginationComponent, NgClass, CurrencyPipe, CustomDatePipe],
  templateUrl: './lista-doc-empresa.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaDocEmpresaComponent {
  public readonly showTooltip = signal<{ [key: string]: boolean }>({});

  public readonly loading = signal(false);

  public readonly listInvoices = signal<GeneriResp<any> | null>(null);

  constructor(
    private readonly docService: DocumentosService,
    public readonly config: ConfigFacturacionService,
    private readonly detailsService: DetailsService,
    private readonly notification: NotificationService,
  ) {
    this.getListInvoices(0);
  }

  toggleTooltip(id: number, isVisible: boolean): void {
    const currentState = this.showTooltip();
    this.showTooltip.set({ ...currentState, [id]: isVisible });
  }

  isTooltipVisible(id: number): boolean {
    return !!this.showTooltip()[id];
  }

  onSyncClick() {
    this.getListInvoices(0);
    this.detailsService.info.set({
      personaRolIde: 1,
    });
  }

  getListInvoices(page: number): void {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.docService.listInvoices(page)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((res) => {
        if (res.status === 'OK') {
          this.detailsService.info.set({
            personaRolIde: 1,
          });
          this.listInvoices.set(res);
        }
      });
  }
  onPageChange(newPage: number): void {
    const pagination = this.listInvoices()?.data?.page;

    if (pagination) {
      pagination.currentPage = newPage;

      // Lógica adicional para manejar hasNext y hasPrevious
      pagination.hasNext = newPage < pagination.totalPages;
      pagination.hasPrevious = newPage > 1;

      this.getListInvoices(newPage);
      // Aquí puedes realizar acciones adicionales, como cargar datos desde un servidor
    }
  }

  reeviarEmail(id: number) {
    // of(this.loading.set(true))
    //   .pipe(
    //     mergeMap(() => this.counterService.sendNotification(id)),
    //     finalize(() => this.loading.set(false)),
    //   )
    //   .subscribe((res) => {
    //     if (res.status === 'OK') {
    //       this.notification.push({
    //         message: 'Correo enviado correctamente',
    //         type: 'success',
    //       });
    //     }
    //   });
  }
}
