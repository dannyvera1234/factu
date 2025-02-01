import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';
import { GeneriResp } from '@/interfaces';
import { ConfigFacturacionService, NotificationService } from '@/utils/services';
import { CurrencyPipe } from '@angular/common';
import { PaginationComponent } from '@/components/pagination';
import { CustomDatePipe } from '@/pipes';
import { of, mergeMap, finalize } from 'rxjs';
import { DocumentosService } from '@/services/service-empresas';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalComponent } from '@/components';
import { DeleteProformaComponent } from '../../../delete-proforma';

@Component({
  selector: 'app-tabla-registrada',
  imports: [PaginationComponent, CurrencyPipe, CustomDatePipe, FormsModule, ModalComponent, DeleteProformaComponent],
  templateUrl: './tabla-registrada.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablaRegistradaComponent {
  public readonly listProformas = signal<GeneriResp<any> | null>(null);

  public readonly showTooltip = signal<{ [key: string]: boolean }>({});

  public readonly allSelected = signal(false);

  public readonly ideDeleteProdorma = signal<number | null>(null);

  public readonly loading = signal(false);

  @Output() public readonly ideProformas = new EventEmitter<number[] | null>();

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

  toggleTooltip(id: number, isVisible: boolean): void {
    const currentState = this.showTooltip();
    this.showTooltip.set({ ...currentState, [id]: isVisible });
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
      invoice.selected = checked;
    });

    this.updateSelectAll();
  }

  selectIndividual(invoice: any) {
    invoice.selected = !invoice.selected;

    // Verifica si todos están seleccionados para sincronizar el checkbox "Seleccionar todo"
    const allSelected = this.listProformas()!.data.listData.every((item: any) => item.selected);
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
        }
      });
  }


}
