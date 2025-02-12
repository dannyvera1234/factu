import { ChangeDetectionStrategy, Component, HostListener, Input, signal } from '@angular/core';
import { of, mergeMap, finalize } from 'rxjs';
import { GeneriResp } from '@/interfaces';
import { ConfigFacturacionService, NotificationService } from '@/utils/services';
import { PaginationComponent } from '@/components/pagination';
import { CurrencyPipe, NgClass, SlicePipe } from '@angular/common';
import { CustomDatePipe } from '@/pipes';
import { DocumentosService } from '@/services/service-empresas';
import { DetailsService } from '@/feature-counters/details-counter-application';
import { ModalComponent } from '@/components';
import { DeleteFacturaComponent } from '../delete-factura';
import { FormsModule } from '@angular/forms';
import { FiltroComponent } from './components';

@Component({
  selector: 'app-lista-doc-empresa',
  imports: [
    PaginationComponent,
    NgClass,
    CurrencyPipe,
    CustomDatePipe,
    SlicePipe,
    ModalComponent,
    DeleteFacturaComponent,
    FormsModule,
    FiltroComponent,
  ],
  templateUrl: './lista-doc-empresa.component.html',
  styles: `
    #optionsMenu {
      transition: opacity 0.3s ease-in-out;
    }
    @media (max-width: 480px) {
      /* En pantallas aún más pequeñas, reducimos más el tamaño de la fuente */
      .table-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch; /* Para soporte en dispositivos táctiles */
      }
    }
    @media (max-width: 768px) {
      .table-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch; /* Para soporte en dispositivos táctiles */
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaDocEmpresaComponent {
  // Detecta clics fuera del componente para cerrar el menú
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    // Si el clic no es dentro de la tabla o el botón de configuración, cerramos el menú
    const menu = (event.target as HTMLElement).closest('.group');
    if (!menu) {
      this.selectedRow.set(null);
    }
  }

  @Input({ required: true }) idePersonaRol!: number;

  searchQuery = '';

  public readonly ideDeleteFactura = signal<number | null>(null);

  public readonly selectedRow = signal<number | null>(null);

  public readonly showTooltip = signal<{ [key: string]: boolean }>({});

  public readonly loading = signal(false);

  public readonly listInvoices = signal<GeneriResp<any> | null>(null);

  public readonly historial = signal<GeneriResp<any> | null>(null);

  private readonly requestedHistories = new Set<number>();
  constructor(
    private readonly docService: DocumentosService,
    public readonly config: ConfigFacturacionService,
    private readonly detailsService: DetailsService,
    private readonly notification: NotificationService,
  ) {
    this.getListInvoices(0);
  }

  /**
   * Elimina una factura de la lista de facturas.
   * @param ide Número de identificación de la factura a eliminar.
   */
  eliminarFactura(ide: number): void {
    const currentInvoices = this.listInvoices();
    if (!currentInvoices?.data?.listData) return;

    // Creamos una copia de la lista actual con la factura eliminada
    const newInvoices = {
      ...currentInvoices,
      data: {
        ...currentInvoices.data,
        listData: currentInvoices!.data!.listData!.filter((invoice: any) => invoice.ide != ide),
      },
    };

    // Actualizamos la lista de facturas
    this.listInvoices.set(newInvoices);
  }


  toggleTooltip(id: number, isVisible: boolean): void {
    const currentState = this.showTooltip();

    // Evitar actualizaciones innecesarias
    if (currentState[id] === isVisible) return;

    this.showTooltip.set({ ...currentState, [id]: isVisible });

    // Solo llamar al servicio si se muestra el tooltip y no se ha solicitado antes
    if (isVisible && !this.requestedHistories.has(id)) {
      this.requestedHistories.add(id);

      this.docService.histories(id).subscribe((res) => {
        if (res.status === 'OK') {
          this.historial.set(res);
        }
      });
    }
  }

  isTooltipVisible(id: number): boolean {
    return !!this.showTooltip()[id];
  }

  onSyncClick() {
    this.getListInvoices();
    this.detailsService.info.set({
      personaRolIde: 1,
    });
  }

  onSearchClick(): void {
    // Si el término de búsqueda está vacío, puedes manejarlo de alguna manera, como mostrar un mensaje de error.
    if (this.searchQuery.trim()) {
      this.getListInvoices(0, this.searchQuery); // Realiza la búsqueda desde la primera página
    } else {
      this.getListInvoices();
    }
  }

  getListInvoices(page: number = 0, searchTerm: string = ''): void {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.docService.listInvoices(page, searchTerm)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((res) => {
        if (res.status === 'OK') {
          console.log(res);
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

  copyToClipboard(text: string): void {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.notification.push({
          message: 'Se copió la clave de acceso.',
          type: 'success',
        });
      })
      .catch((err) => {
        console.error('Error al copiar al portapapeles: ', err);
      });
  }

  // Función para alternar la visibilidad del menú
  toggleMenu(rowIndex: number): void {
    // Si ya está abierto, lo cerramos; si no, lo abrimos
    if (this.selectedRow() === rowIndex) {
      this.selectedRow.set(null);
    } else {
      this.selectedRow.set(rowIndex);
    }
  }
}
