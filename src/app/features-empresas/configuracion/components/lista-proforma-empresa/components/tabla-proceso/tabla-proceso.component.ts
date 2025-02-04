import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PaginationComponent } from '@/components/pagination';
import { GeneriResp } from '@/interfaces';
import { CurrencyPipe } from '@angular/common';
import { CustomDatePipe } from '@/pipes';
import { ConfigFacturacionService } from '@/utils/services';
import { finalize, mergeMap, of } from 'rxjs';
import { DocumentosService } from '../../../../../../services/service-empresas';

@Component({
  selector: 'app-tabla-proceso',
  imports: [PaginationComponent, CurrencyPipe, CustomDatePipe],
  templateUrl: './tabla-proceso.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablaProcesoComponent {
  public readonly listProformasProcess = signal<GeneriResp<any> | null>(null);

  public readonly showTooltip = signal<{ [key: string]: boolean }>({});

  public readonly loading = signal(false);

  constructor(public readonly config: ConfigFacturacionService,
    private readonly docService: DocumentosService
  ) {
    this.listInvoicesProformaEnProceso(0);
  }

  onPageChange(newPage: number): void {
    const pagination = this.listProformasProcess()?.data?.page;

    if (pagination) {
      pagination.currentPage = newPage;

      // Lógica adicional para manejar hasNext y hasPrevious
      pagination.hasNext = newPage < pagination.totalPages;
      pagination.hasPrevious = newPage > 1;

      this.listInvoicesProformaEnProceso(newPage);
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

  listInvoicesProformaEnProceso(page: number){
    of(this.loading.set(true))
    .pipe(
      mergeMap(() => this.docService.listInvoicesProformaEnProceso(page)),
      finalize(() => this.loading.set(false)),
    )
    .subscribe((res) => {
      if (res.status === 'OK') {
         this.listProformasProcess.set(res);
      }
    });
  }
}
