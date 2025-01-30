import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PaginationComponent } from '@/components/pagination';
import { CurrencyPipe } from '@angular/common';
import { GeneriResp } from '@/interfaces';
import { ConfigFacturacionService, NotificationService } from '@/utils/services';
import { CustomDatePipe } from '@/pipes';
import { of, mergeMap, finalize } from 'rxjs';
import { DocumentosService } from '@/services/service-empresas';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalComponent } from '@/components';
import { DeleteProformaComponent } from '../delete-proforma';
import { FiltersProformaComponent } from './components';

@Component({
  selector: 'app-lista-proforma-empresa',
  imports: [PaginationComponent, CustomDatePipe, CurrencyPipe, FormsModule, ModalComponent, DeleteProformaComponent, FiltersProformaComponent],
  templateUrl: './lista-proforma-empresa.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaProformaEmpresaComponent {
  public readonly loading = signal(false);

  public readonly showTooltip = signal<{ [key: string]: boolean }>({});

  public readonly listProformas = signal<GeneriResp<any> | null>(null);

  public readonly allSelected = signal(false);

  public readonly ideDeleteProdorma = signal<number | null>(null);

  searchQuery: string = '';

  constructor(
    public readonly config: ConfigFacturacionService,
    private readonly docService: DocumentosService,
    private readonly notification: NotificationService,
    private router: Router,
  ) {
    this.getListInvoices(0);
  }

  onSearchChange(): void {
    const query = this.searchQuery.trim().toLowerCase();

    if (this.listProformas() && query) {
      // Verifica que 'listData' sea un array y tenga elementos
      const listData = this.listProformas()!.data.listData;

      // Filtra las proformas según el texto ingresado, por cada letra
      const filteredProformas = listData.filter((invoice: any) => {
        const socialReasonMatch = invoice.socialReasonCustomer
          ? invoice.socialReasonCustomer.toLowerCase().includes(query)
          : false;
        const identificationMatch = invoice.identificationCustomer
          ? invoice.identificationCustomer.toString().includes(query)
          : false;

        return socialReasonMatch || identificationMatch;
      });

      // Actualiza el estado con las proformas filtradas
      this.listProformas.set({
        ...this.listProformas()!,
        data: {
          ...this.listProformas()!.data,
          listData: filteredProformas,
        },
      });
    } else {
      // Si el campo de búsqueda está vacío, mostramos todas las proformas
      this.getListInvoices(0);
    }
  }

  selectAll(event: any) {
    const checked = event.target.checked; // Obtiene el estado del checkbox "Seleccionar todo"
    this.listProformas()!.data.listData.forEach((invoice: any) => {
      invoice.selected = checked; // Asigna el estado al checkbox de cada fila
    });

    this.updateSelectAll();
  }

  updateSelectAll() {
    // Verifica si todos los elementos están seleccionados
    const allSelectedValue = this.listProformas()!.data.listData.every((invoice: any) => invoice.selected);

    // Actualiza el estado de "Seleccionar todo" con el valor calculado
    this.allSelected.set(allSelectedValue);
  }

  convertirProforma() {
    const proformasSeleccionadas = this.listProformas()!.data.listData.filter((invoice: any) => invoice.selected);

    if (proformasSeleccionadas.length) {
      // Si hay proformas seleccionadas, muestra sus ide
      proformasSeleccionadas.forEach((invoice: any) => console.log(invoice.ide));
    } else {
      // Si no hay proformas seleccionadas, muestra una notificación
      this.notification.push({
        message: 'Por favor, seleccione al menos una proforma para continuar.',
        type: 'error',
      });
    }
  }

  toggleTooltip(id: number, isVisible: boolean): void {
    const currentState = this.showTooltip();
    this.showTooltip.set({ ...currentState, [id]: isVisible });
  }

  isTooltipVisible(id: number): boolean {
    return !!this.showTooltip()[id];
  }

  editarProforma(ideEncrypted: number) {
    if (ideEncrypted) {
      this.router.navigate(['/sistema_contable_empresa/emision_empresas', ideEncrypted]);
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

  eliminarProforma(id: number) {
    if (id) {
      this.getListInvoices(0);
    }
  }


}
