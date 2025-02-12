import { ChangeDetectionStrategy, Component, HostListener, Input, signal } from '@angular/core';
import { ClientesService, DocumentosService } from '@/services/service-empresas';
import { finalize, mergeMap, of } from 'rxjs';
import { GeneriResp } from '@/interfaces';
import { CurrencyPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { NotificationService } from '@/utils/services';
import { PaginationComponent } from '@/components/pagination';
import { CustomPipe } from '@/pipes';
import { HistorialPagoComponent } from '../historial-pago';

@Component({
  selector: 'app-lista-doc',
  imports: [NgOptimizedImage, CurrencyPipe, NgClass, PaginationComponent,HistorialPagoComponent, CustomPipe],
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

  toggleMenu(rowIndex: number): void {
    this.selectedRow.set(this.selectedRow() === rowIndex ? null : rowIndex);
  }

  invoiceCustomers(idePersonaRol: number, page: number): void {
    const paginaator = {
      size: 5,
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
          console.log(resp);
          this.listInvoices.set(resp);
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
