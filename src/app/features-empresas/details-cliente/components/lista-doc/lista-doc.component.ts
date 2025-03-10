import { ChangeDetectionStrategy, Component, Input, OnInit, signal } from '@angular/core';
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
import { ModalComponent, ViewerDocumentComponent } from '@/components';
import { ButtonModule } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { CardCreditComponent } from '../card-credit';
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
    ModalComponent,
    Menu,
    ButtonModule,
    CardCreditComponent,
  ],
  templateUrl: './lista-doc.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaDocComponent implements OnInit {
  @Input({ required: true }) set idePersonaRol(value: number) {
    if (value === null) return;
    this.invoiceCustomers(value);
    this.idePersona.set(value);
  }
  public readonly showTooltip = signal<{ [key: string]: boolean }>({});
  public readonly listInvoices = signal<GeneriResp<any> | null>(null);
  public readonly historial = signal<GeneriResp<any> | null>(null);
  public readonly currentDocumentUrl = signal<string | null>(null);
  public readonly showDetails = signal<number | null>(null);
  public readonly historialPago = signal<any | null>(null);
  public readonly actulizarCard = signal<any | null>(null);
  private readonly requestedHistories = new Set<number>();
  public readonly selectedRow = signal<any | null>(null);
  public readonly loadingHstorial = signal(false);
  public readonly idePersona = signal<number>(0);
  public readonly loadingShow = signal(false);
  public readonly isModalOpen = signal(false);
  public readonly loading = signal(false);
  private size = Modulos.PAGE_SIZE;
  public statusFilters: any | null = null;
  public items: any[] = [];
  public searchQuery = '';
  private page = 0;

  constructor(
    private readonly clienteService: ClientesService,
    private readonly docService: DocumentosService,
    private readonly notification: NotificationService,
  ) {}
  ngOnInit(): void {
    this.items = [
      {
        items: [
          {
            label: 'PDF',
            icon: 'pi pi-print',
            command: () => this.openDocument(this.selectedRow().pdf),
          },
          {
            label: 'XML',
            icon: 'pi pi-file',
            command: () => this.openDocument(this.selectedRow().xml),
          },
          {
            label: 'Reporte',
            icon: 'pi pi-download',
            command: () => this.generateReporteInvoiceCredito(this.selectedRow().ide),
          },
          {
            label: 'Configuración',
            icon: 'pi pi-cog',
          },
          {
            label: 'Reenviar',
            icon: 'pi pi-send',
            command: () => this.reeviarEmail(this.selectedRow().ide),
          },
        ],
      },
    ];
  }

  toggleTooltip(id: any): void {
    of(this.loadingHstorial.set(true))
      .pipe(
        mergeMap(() => this.docService.histories(id)),
        finalize(() => this.loadingHstorial.set(false)),
      )
      .subscribe((res) => {
        if (res.status === 'OK') {
          this.historial.set(res);
        }
      });
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

  toggleHistory(invoice: any) {
    if (this.loadingShow()) return; // Evita ejecutar si ya está cargando

    const ide = invoice.ide as number;
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
            console.log(resp);
            this.historialPago.set({
              respHistoriaPago: resp,
              montoPagado: invoice?.creditPaymentAmount || 0.0,
            });
          }
        });
    }
  }

  updateletterPay(item: any) {
    if (!item) return;
    this.actulizarCard.set({ ide: this.idePersona()! });
    this.invoiceCustomers(this.idePersona());
  }

  isTooltipVisible(id: number): boolean {
    return !!this.showTooltip()[id];
  }

  toggleMenu(rowIndex: number): void {
    this.selectedRow.set(this.selectedRow() === rowIndex ? null : rowIndex);
  }

  onSearchClick() {
    this.invoiceCustomers(this.idePersona());
  }



  filter(statusFilter: any) {
    this.statusFilters = statusFilter;
    this.invoiceCustomers(this.idePersona());
  }

  invoiceCustomers(idePersonaRol: number): void {
    const paginator = {
      size: this.size,
      page: this.page,
      search: this.searchQuery,
      apply: true,
      filterModel: {
        statusLetter: this.statusFilters,
      },
    };
    console.log(paginator);
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.clienteService.docCustomer(idePersonaRol, paginator)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          console.log(resp);

          // Verificar que listData exista y sea un arreglo
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
    this.invoiceCustomers(this.idePersona()!);
  }

  onPageChange(newPage: number): void {
    const pagination = this.listInvoices()?.data?.page;

    if (pagination) {
      pagination.currentPage = newPage;

      // Lógica adicional para manejar hasNext y hasPrevious
      pagination.hasNext = newPage < pagination.totalPages;
      pagination.hasPrevious = newPage > 1;
      this.page = newPage;
      this.invoiceCustomers(this.idePersona());
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
          this.selectedRow.set(null);
          this.notification.push({
            message: 'Correo enviado correctamente',
            type: 'success',
          });
        }
      });
  }

  generateReporteInvoiceCredito(ide: number) {
    this.docService.generateReporteInvoiceCredito(ide).subscribe((blob: Blob) => {
      this.selectedRow.set(null);
      const url = URL.createObjectURL(blob);
      this.openDocument(url);
    });
  }
}
