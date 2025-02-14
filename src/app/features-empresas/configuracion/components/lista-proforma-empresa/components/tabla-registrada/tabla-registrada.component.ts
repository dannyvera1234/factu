import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output, signal } from '@angular/core';
import { GeneriResp } from '@/interfaces';
import { ConfigFacturacionService, NotificationService } from '@/utils/services';
import { CurrencyPipe } from '@angular/common';
import { PaginationComponent } from '@/components/pagination';
import { CustomDatePipe } from '@/pipes';
import { of, mergeMap, finalize } from 'rxjs';
import { DocumentosService } from '@/services/service-empresas';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalComponent, ViewerDocumentComponent } from '@/components';
import { DeleteProformaComponent } from '../../../delete-proforma';

@Component({
  selector: 'app-tabla-registrada',
  imports: [PaginationComponent, CurrencyPipe, CustomDatePipe, FormsModule, ModalComponent, DeleteProformaComponent, ViewerDocumentComponent],
  templateUrl: './tabla-registrada.component.html',
  styles: `
    #optionsMenu {
      transition: opacity 0.3s ease-in-out;
      overflow: none;
      z-index: 999;
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
export class TablaRegistradaComponent {
  @Input({ required: true }) set ideIvoices(value: any) {
    if (value) {
      this.getListInvoices(0);
      this.finalizar.emit(null);
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    // Si el clic no es dentro de la tabla o el botón de configuración, cerramos el menú
    const menu = (event.target as HTMLElement).closest('.group');
    if (!menu) {
      this.selectedRow.set(null);
    }
  }

  public readonly selectedRow = signal<number | null>(null);

  public readonly listProformas = signal<GeneriResp<any> | null>(null);

  public readonly showTooltip = signal<{ [key: string]: boolean }>({});

  public readonly allSelected = signal(false);

  public readonly ideDeleteProdorma = signal<number | null>(null);

  public readonly loading = signal(false);

  public readonly currentDocumentUrl = signal<string | null>(null);
  public readonly isModalOpen = signal(false);
  private readonly requestedHistories = new Set<number>();
  public readonly historial = signal<GeneriResp<any> | null>(null)

  @Output() public readonly ideProformas = new EventEmitter<number[] | null>();

  @Output() finalizar = new EventEmitter<null>();

  constructor(
    public readonly config: ConfigFacturacionService,
    private readonly docService: DocumentosService,
    private readonly notification: NotificationService,
    private readonly router: Router,
  ) {
    this.getListInvoices(0);
  }

  onPageChange(newPage: number): void {
    const pagination = this.listProformas()?.data?.page;

    if (pagination) {
      pagination.currentPage = newPage;

      // Lógica adicional para manejar hasNext y hasPrevious
      pagination.hasNext = newPage < pagination.totalPages;
      pagination.hasPrevious = newPage > 1;

      this.getListInvoices(newPage);
      // Aquí puedes realizar acciones adicionales, como cargar datos desde un servidor
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

  isTooltipVisible(id: number): boolean {
    return !!this.showTooltip()[id];
  }

  reeviarEmail(id: number) {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.docService.sendNotificationProforma(id)),
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

  selectAll(event: any) {
    const checked = event.target.checked;

    // Actualiza todos los elementos
    this.listProformas()!.data.listData.forEach((invoice: any) => {
      if (invoice.statusProcess !== 'EN PROCESO PROFORMA' && (invoice.authorizationStatus !== 'NO AUTORIZADO' || invoice.receptionStatus === 'DEVUELTA')) {
        invoice.selected = checked;
      }
    });

    this.updateSelectAll();
  }

  selectIndividual(invoice: any) {
    invoice.selected = !invoice.selected;

    // Verifica si todos están seleccionados para sincronizar el checkbox "Seleccionar todo"
    const allSelected = this.listProformas()!.data.listData.every((item: any) => {
      if (item.statusProcess !== 'EN PROCESO PROFORMA' && (invoice.authorizationStatus !== 'NO AUTORIZADO' || invoice.receptionStatus === 'DEVUELTA')) {
        item.selected;
      }
    });
    this.allSelected.set(allSelected);

    this.convertirProforma(); // Actualiza proformas seleccionadas al hacer selección individual
  }

  updateSelectAll() {
    const allSelectedValue = this.listProformas()!.data.listData.every((invoice: any) => invoice.selected);
    this.allSelected.set(allSelectedValue);

    // Actualiza la lista de proformas seleccionadas al seleccionar todos
    this.convertirProforma();
  }

  convertirProforma() {
    // Filtra las proformas seleccionadas
    const proformasSeleccionadas = this.listProformas()!.data.listData.filter((invoice: any) => invoice.selected);

    // Si hay cambios en la selección, emite la lista de IDs
    const ideList = proformasSeleccionadas.map((invoice: any) => invoice.ide);

    // Solo emite si la lista de IDs ha cambiado (optimización)
    if (this.ideProformas.emit() !== ideList) {
      this.ideProformas.emit(ideList);
    }
  }

  editarProforma(ideEncrypted: number) {
    if (ideEncrypted) {
      this.router.navigate(['/sistema_contable_empresa/emision_empresas', ideEncrypted]);
    }
  }

  eliminarProforma(id: number) {
    if (id) {
      this.getListInvoices(0);
    }
  }

  getListInvoices(page: number): void {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.docService.listProforma(page)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((res) => {
        if (res.status === 'OK') {
          this.listProformas.set(res);
          this.allSelected.set(false);

          // Deselecciona todas las proformas
          this.listProformas()!.data.listData.forEach((invoice: any) => {
            invoice.selected = false;
          });

          // Limpia la lista emitida si es necesario
          this.ideProformas.emit([]);
        }
      });
  }

  toggleMenu(rowIndex: number): void {
    // Si ya está abierto, lo cerramos; si no, lo abrimos
    if (this.selectedRow() === rowIndex) {
      this.selectedRow.set(null);
    } else {
      this.selectedRow.set(rowIndex);
    }
  }
}
