import { ChangeDetectionStrategy, Component, HostListener, Input, signal } from '@angular/core';
import { of, mergeMap, finalize } from 'rxjs';
import { DetailsService } from '../../../../feature-counters/details-counter-application';
import { GeneriResp } from '../../../../interfaces';
import { DocumentosService } from '../../../../services/service-empresas';
import { ConfigFacturacionService, NotificationService } from '../../../../utils/services';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-lista-credito',
  imports: [FormsModule, NgClass],
  templateUrl: './lista-credito.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaCreditoComponent {
// Detecta clics fuera del componente para cerrar el menú
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    // Si el clic no es dentro de la tabla o el botón de configuración, cerramos el menú
    const menu = (event.target as HTMLElement).closest('.group');
    if (!menu) {
      this.selectedRow.set(null);
    }
  }


  searchQuery = '';

  public readonly ideDeleteFactura = signal<number | null>(null);

  public readonly selectedRow = signal<number | null>(null);

  public readonly showTooltip = signal<{ [key: string]: boolean }>({});

  public readonly loading = signal(false);

  public readonly listInvoices = signal<GeneriResp<any> | null>(null);

  constructor(
    private readonly docService: DocumentosService,
    public readonly config: ConfigFacturacionService,
    private readonly detailsService: DetailsService,
    private readonly notification: NotificationService,
  ) {
    this.getListInvoicesCredit(0);
  }



  toggleTooltip(id: number, isVisible: boolean): void {
    const currentState = this.showTooltip();
    this.showTooltip.set({ ...currentState, [id]: isVisible });
  }

  isTooltipVisible(id: number): boolean {
    return !!this.showTooltip()[id];
  }

  onSyncClick() {
    this.getListInvoicesCredit();
    this.detailsService.info.set({
      personaRolIde: 1,
    });
  }

  onSearchClick(): void {
    // Si el término de búsqueda está vacío, puedes manejarlo de alguna manera, como mostrar un mensaje de error.
    if (this.searchQuery.trim()) {
      this.getListInvoicesCredit(0, this.searchQuery); // Realiza la búsqueda desde la primera página
    } else {
      this.getListInvoicesCredit();
    }
  }

  getListInvoicesCredit(page: number = 0, searchTerm: string = ''): void {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.docService.lisroInvoicesCredito(page, searchTerm)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((res) => {
        if (res.status === 'OK') {
          console.log(res);
          // this.detailsService.info.set({
          //   personaRolIde: 1,
          // });
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

      this.getListInvoicesCredit(newPage);
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


