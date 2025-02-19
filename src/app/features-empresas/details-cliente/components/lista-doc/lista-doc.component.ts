import { ChangeDetectionStrategy, Component, computed, HostListener, Input, signal } from '@angular/core';
import { ClientesService, DocumentosService } from '@/services/service-empresas';
import { finalize, mergeMap, of } from 'rxjs';
import { GeneriResp } from '@/interfaces';
import { CurrencyPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { NotificationService } from '@/utils/services';
import { PaginationComponent } from '@/components/pagination';
import { CustomPipe } from '@/pipes';
import { HistorialPagoComponent } from '../historial-pago';
import { Modulos } from '@/utils/permissions';
import { FormsModule } from '@angular/forms';
import { ViewerDocumentComponent } from '@/components';

@Component({
  selector: 'app-lista-doc',
  imports: [
    NgOptimizedImage,
    CurrencyPipe,
    NgClass,
    PaginationComponent,
    HistorialPagoComponent,
    CustomPipe,
    FormsModule,
    ViewerDocumentComponent,
  ],
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
    this.invoiceCustomers(value, 0, '');
    this.idePersona.set(value);
  }

  public readonly maxDate = computed(() => {
    return new Date().toISOString().split('T')[0]; // Fecha actual si no hay fecha de inicio
  });

  private readonly idePersona = signal<number | null>(null);
  public readonly showDetails = signal<number | null>(null);
  public readonly selectedRow = signal<number | null>(null);
  public readonly listInvoices = signal<GeneriResp<any> | null>(null);
  public readonly historialPago = signal<GeneriResp<any> | null>(null);
  public readonly loading = signal(false);
  public readonly loadingShow = signal(false);
  public readonly showTooltip = signal<{ [key: string]: boolean }>({});
  private readonly requestedHistories = new Set<number>();
  public readonly historial = signal<GeneriResp<any> | null>(null);
  public readonly currentDocumentUrl = signal<string | null>(null);
  public readonly isModalOpen = signal(false);

  searchQuery = '';

  constructor(
    private readonly clienteService: ClientesService,
    private readonly docService: DocumentosService,
    private readonly notification: NotificationService,
  ) {}

  toggleTooltip(id: number, isVisible: boolean): void {
    const currentState = this.showTooltip();

    // Solo actualizar si el estado cambia
    if (currentState[id] === isVisible) return;

    // Cierra todos los tooltips excepto el actual
    this.showTooltip.set(isVisible ? { [id]: true } : {});

    if (isVisible && !this.requestedHistories.has(id)) {
      this.requestedHistories.add(id);
      this.docService.histories(id).subscribe((res) => {
        if (res.status === 'OK') {
          this.historial.set(res);
        }
      });
    }
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

  toggleHistory(ide: number) {
    if (this.loadingShow()) return; // Evita ejecutar si ya está cargando

    const currentId = this.showDetails();

    if (currentId === ide) {
      this.showDetails.set(null);
    } else {
      this.loadingShow.set(true);
      this.showDetails.set(ide);

      this.clienteService
        .historialPago(ide)
        .pipe(finalize(() => this.loadingShow.set(false)))
        .subscribe((resp) => {
          if (resp.status === 'OK') {
            this.historialPago.set(resp);
          }
        });
    }
  }
  updateletterPay(item: any) {
    if (!item) return;
    this.invoiceCustomers(this.idePersona()!, 0, '');
  }

  isTooltipVisible(id: number): boolean {
    return !!this.showTooltip()[id];
  }

  toggleMenu(rowIndex: number): void {
    this.selectedRow.set(this.selectedRow() === rowIndex ? null : rowIndex);
  }

  onSearchClick() {
    this.invoiceCustomers(this.idePersona()!, 0, this.searchQuery);
  }

  invoiceCustomers(idePersonaRol: number, page: number, searchTerm: string): void {
    const paginator = {
      size: Modulos.PAGE_SIZE,
      page: page,
      search: searchTerm,
    };
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.clienteService.docCustomer(idePersonaRol, paginator)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          // Verificar que listData exista y sea un arreglo
          console.log(resp);
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
      });
  }

  onSyncClick() {
    this.requestedHistories.clear();
    this.invoiceCustomers(this.idePersona()!, 0, '');
  }

  onPageChange(newPage: number): void {
    const pagination = this.listInvoices()?.data?.page;

    if (pagination) {
      pagination.currentPage = newPage;

      // Lógica adicional para manejar hasNext y hasPrevious
      pagination.hasNext = newPage < pagination.totalPages;
      pagination.hasPrevious = newPage > 1;

      this.invoiceCustomers(this.idePersona()!, newPage, '');
      // Aquí puedes realizar acciones adicionales, como cargar datos desde un servidor
    }
  }
  reeviarEmail(id: number) {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.docService.letterPayNotification(id)),
        finalize(() => this.loading.set(false)),
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
