import { ChangeDetectionStrategy, Component, HostListener, Input, signal } from '@angular/core';
import { ClientesService, DocumentosService } from '@/services/service-empresas';
import { finalize, mergeMap, of } from 'rxjs';
import { GeneriResp } from '@/interfaces';
import { CurrencyPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { NotificationService } from '@/utils/services';
import { PaginationComponent } from '@/components/pagination';
import { CustomPipe } from '@/pipes';
import { HistorialPagoComponent } from '../historial-pago';
import { Modulos } from '@/utils/permissions';

@Component({
  selector: 'app-lista-doc',
  imports: [NgOptimizedImage, CurrencyPipe, NgClass, PaginationComponent, HistorialPagoComponent, CustomPipe],
  templateUrl: './lista-doc.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaDocComponent {
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    // Si el clic no es dentro de la tabla o el botón de configuración, cerramos el menú
    const menu = (event.target as HTMLElement).closest('.group');
    if (!menu) {
      this.selectedRow.set(null);
    }
  }

  @Input({ required: true }) set idePersonaRol(value: number) {
    if (value === null) return;
    this.invoiceCustomers(value, 0);
    this.idePersona.set(value);
  }

  private readonly idePersona = signal<number | null>(null);

  public readonly showDetails = signal<number | null>(null);

  public readonly selectedRow = signal<number | null>(null);

  public readonly listInvoices = signal<GeneriResp<any> | null>(null);

  public readonly historialPago = signal<GeneriResp<any> | null>(null);

  public readonly loading = signal(false);

  public readonly loadingShow = signal(false);

  onSearch = '';

  constructor(
    private readonly clienteService: ClientesService,
    private readonly docService: DocumentosService,
    private readonly notification: NotificationService,
  ) {}

  toggleHistory(ide: number) {
    if (this.showDetails() === ide) {
      this.showDetails.set(null);
    } else {
      of(this.loadingShow.set(true), this.showDetails.set(ide))
        .pipe(
          mergeMap(() => this.clienteService.historialPago(ide)),
          finalize(() => this.loadingShow.set(false)),
        )
        .subscribe((resp) => {
          if (resp.status === 'OK') {
            this.historialPago.set(resp);
            console.log(resp);
          }
        });
    }
  }
  public readonly showTooltip = signal<{ [key: string]: boolean }>({});
  private readonly requestedHistories = new Set<number>();
  public readonly historial = signal<GeneriResp<any> | null>(null);

  toggleTooltip(id: number, isVisible: boolean): void {
    const currentState = this.showTooltip();

    // Evitar actualizaciones innecesarias
    if (currentState[id] === isVisible) return;

    this.showTooltip.set({ ...currentState, [id]: isVisible });

    if (isVisible && !this.requestedHistories.has(id)) {
      this.requestedHistories.add(id);
      this.docService.histories(id).subscribe((res) => {
        if (res.status === 'OK') {
          this.historial.set(res);
        }
      });
    } else if (!isVisible) {
      this.requestedHistories.delete(id); // Solo eliminar el ID actual
    }
  }

  isTooltipVisible(id: number): boolean {
    return !!this.showTooltip()[id];
  }

  toggleMenu(rowIndex: number): void {
    this.selectedRow.set(this.selectedRow() === rowIndex ? null : rowIndex);
  }

  invoiceCustomers(idePersonaRol: number, page: number): void {
    const paginaator = {
      size: Modulos.PAGE_SIZE,
      page: page,
      search: this.onSearch,
    };

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.clienteService.docCustomer(idePersonaRol, paginaator)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          // Verificar que listData exista y sea un arreglo
          if (Array.isArray(resp.data.listData)) {
            const sortedInvoices = resp.data.listData.sort((a: any, b: any) => {
              if (a.saleType === 'Crédito' && b.saleType !== 'Crédito') return -1;
              if (a.saleType !== 'Crédito' && b.saleType === 'Crédito') return 1;
              return 0; // Mantener el orden cuando ambos son iguales
            });

            this.listInvoices.set({
              ...resp,
              data: {
                ...resp.data,
                listData: sortedInvoices,
              },
            });
          }
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

      this.invoiceCustomers(this.idePersona()!, newPage);
      // Aquí puedes realizar acciones adicionales, como cargar datos desde un servidor
    }
  }
  reeviarEmail(id: number) {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.docService.sendNotification(id)),
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
