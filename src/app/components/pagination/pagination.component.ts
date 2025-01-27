import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  @Input() paginationData!: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    numElementsByPage: number;
    totalElements: number;
  };

  @Output() pageChange = new EventEmitter<number>();

  //  Cálculo del índice del primer elemento mostrado (empezando desde 0)
  get startIndex(): number {
    return this.paginationData?.currentPage ? (this.paginationData.currentPage - 1) * this.paginationData.numElementsByPage + 1 : 0;
  }

  get endIndex(): number {
    if (this.paginationData) {
      return Math.min(
        this.paginationData.currentPage * this.paginationData.numElementsByPage,
        this.paginationData.totalElements
      );
    }
    return 0;
  }

  // Cambiar de página (ajustar a 0-indexado)
  changePage(newPage: number): void {
    // Emitimos el cambio de página, asegurándonos de que se pasa correctamente desde 0
    this.pageChange.emit(newPage);
  }
}
