import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PaginationComponent } from '@/components/pagination';
import { CurrencyPipe } from '@angular/common';
import { GeneriResp } from '@/interfaces';
import { ConfigFacturacionService, NotificationService } from '@/utils/services';
import { CustomDatePipe } from '@/pipes';
import { of, mergeMap, finalize } from 'rxjs';
import { DocumentosService } from '@/services/service-empresas';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-proforma-empresa',
  imports: [PaginationComponent, CustomDatePipe, CurrencyPipe, FormsModule],
  templateUrl: './lista-proforma-empresa.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaProformaEmpresaComponent {
  public readonly loading = signal(false);

  public readonly showTooltip = signal<{ [key: string]: boolean }>({});

  public readonly listProformas = signal<GeneriResp<any> | null>(null);

  constructor(
    public readonly config: ConfigFacturacionService,
    private readonly docService: DocumentosService,
    private readonly notification: NotificationService,
  ) {
    this.getListInvoices(0);
  }
  allSelected = false;

  selectAll(event: any) {
    const checked = event.target.checked;
    console.log(checked)
    this.listProformas()!.data.listData.forEach((invoice:any) => {
      invoice.selected = checked;
    });
  }
  updateSelectAll() {
    this.allSelected = this.listProformas()!.data.listData.every((invoice:any) => invoice.selected);
  }

  toggleTooltip(id: number, isVisible: boolean): void {
    const currentState = this.showTooltip();
    this.showTooltip.set({ ...currentState, [id]: isVisible });
  }

  isTooltipVisible(id: number): boolean {
    return !!this.showTooltip()[id];
  }

  getListInvoices(page: number): void {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.docService.listProforma(page)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((res) => {
        if (res.status === 'OK') {
          console.log(res);
          // this.detailsService.info.set({
          //   personaRolIde: 1,
          // });
          this.listProformas.set(res);
        }
      });
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
}
