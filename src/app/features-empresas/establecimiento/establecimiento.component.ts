import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { GeneriResp } from '../../interfaces';
import { FormatPhonePipe } from '../../pipes';
import { of, mergeMap, finalize } from 'rxjs';
import { SubsidiaryService } from '../../services/service-empresas';
import { ModalComponent } from '../../components';
import { CreateEstablecimientoComponent, DeleteEstablecimientoComponent } from './components';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '../../components/pagination';

@Component({
  selector: 'app-establecimiento',
  imports: [
    NgOptimizedImage,
    FormatPhonePipe,
    ModalComponent,
    CreateEstablecimientoComponent,
    DeleteEstablecimientoComponent,
    FormsModule,
    RouterLink,
    PaginationComponent,
  ],
  templateUrl: './establecimiento.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstablecimientoComponent {
  public readonly subsidiaries = signal<GeneriResp<any> | null>(null);

  public readonly loading = signal(false);

  public readonly viewingIdeSubsidiary = signal<number | null>(null);

  searchQuery = '';

  constructor(private readonly subsidiaryService: SubsidiaryService) {
    this.listSubsidiary(0);
  }

  onSearchClick(): void {
    // Si el término de búsqueda está vacío, puedes manejarlo de alguna manera, como mostrar un mensaje de error.
    if (this.searchQuery.trim()) {
      this.listSubsidiary(0, this.searchQuery); // Realiza la búsqueda desde la primera página
    } else {
      this.listSubsidiary(0);
    }
  }

  listSubsidiary(page: number, search: string = ''): void {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.subsidiaryService.listSubsidiary(page, search)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.subsidiaries.set(resp);
        }
      });
  }

  onPageChange(newPage: number): void {
    const pagination = this.subsidiaries()?.data?.page;

    if (pagination) {
      pagination.currentPage = newPage;

      // Lógica adicional para manejar hasNext y hasPrevious
      pagination.hasNext = newPage < pagination.totalPages;
      pagination.hasPrevious = newPage > 1;

      this.listSubsidiary(newPage);
      // Aquí puedes realizar acciones adicionales, como cargar datos desde un servidor
    }
  }

  createEstable(infoEstablecimiento: any) {
    if (infoEstablecimiento) {
      this.listSubsidiary(0);
    }
  }

  deleteEstable(ideSubsidiary: number): void {
    const Subsidiary = this.subsidiaries();

    if (!Subsidiary?.data?.listData) return;

    const updatedCliente = {
      ...Subsidiary,
      data: {
        ...Subsidiary.data,
        listData: Subsidiary!.data!.listData!.filter(
          (subsidiary: any) => subsidiary.ideSubsidiary !== ideSubsidiary,
        ),
      },
    };

    this.subsidiaries.set(updatedCliente);
  }
}
