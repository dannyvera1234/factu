import { ChangeDetectionStrategy, Component, ElementRef, HostListener, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { of, mergeMap, finalize } from 'rxjs';
import { ViewerDocumentComponent } from '@/components';
import { DocumentosService } from '@/services/service-empresas';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-filter',
  imports: [NgClass, FormsModule, ViewerDocumentComponent],
  templateUrl: './filter.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  @HostListener('document:click', ['$event.target'])
  onClick(btn: any) {
    if (this.open() && !this.ref.nativeElement.contains(btn)) {
      this.open.set(false);
    }
  }

  private readonly TODOS_ESTADOS = ['ATRASADO', 'PENDIENTE', 'PAGADO'];
  public readonly currentDocumentUrl = signal<string | null>(null);
  public readonly selectedEstado = signal<string>('');
  public readonly isModalOpen = signal(false);
  public readonly loading = signal(false);
  public readonly open = signal(false);

  constructor(
    private readonly ref: ElementRef,
    private readonly docService: DocumentosService,
  ) {}

  openDocument(item: any) {
    this.currentDocumentUrl.set(item);
    this.isModalOpen.set(true);
  }

  closeDocument() {
    this.isModalOpen.set(false);
    this.currentDocumentUrl.set(null);
  }

  private getCurrentMonthDates() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      startDate: firstDay.toISOString().split('T')[0], // Formato YYYY-MM-DD
      endDate: lastDay.toISOString().split('T')[0],
    };
  }

  submit() {
    // Determinar los estados a enviar

    const estadosCredito = this.selectedEstado() === 'TODOS' ? this.TODOS_ESTADOS : [this.selectedEstado()];

    // Si el estado es "PENDIENTE", obtener las fechas del mes actual
    let startDate: string | null = null;
    let endDate: string | null = null;
    if (this.selectedEstado() === 'PENDIENTE') {
      ({ startDate, endDate } = this.getCurrentMonthDates());
    }

    const data = { status: estadosCredito };

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.docService.reportCreditoClientes(data, startDate, endDate)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((blob: Blob) => {
        const url = URL.createObjectURL(blob);
        this.openDocument(url);
        this.open.set(false);
      });
  }
}
