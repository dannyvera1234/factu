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
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Modulos } from '../../utils/permissions';

@Component({
  selector: 'app-establecimiento',
  imports: [
    NgOptimizedImage,
    FormatPhonePipe,
    ModalComponent,
    CreateEstablecimientoComponent,
    DeleteEstablecimientoComponent,
    FormsModule,
    TableModule,
    ButtonModule,
    FormsModule,
    Tag,
  ],
  templateUrl: './establecimiento.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstablecimientoComponent {
  public readonly subsidiaries = signal<GeneriResp<any> | null>(null);
  public readonly viewingIdeSubsidiary = signal<number | null>(null);
  public readonly filterSubsidiary = signal<any | null>(null);
  public readonly numElementsByPage = signal<number>(0);
  public readonly open = signal<'nombre' | null>(null);
  public readonly loading = signal(false);
  private size = Modulos.PAGE_SIZE;
  public searchQuery = '';
  private page = 0;

  constructor(private readonly subsidiaryService: SubsidiaryService) {
    this.listSubsidiary();
  }

  toggleFilter(filterName: 'nombre' | null) {
    if (this.open() === filterName) {
      this.open.set(null);
    } else {
      this.open.set(filterName);
    }
  }

  filter() {
    this.open.set(null);
    this.listSubsidiary();
  }

  listSubsidiary(): void {
    const filter = {
      page: this.page,
      size: this.size,
      search: this.searchQuery,
    };
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.subsidiaryService.listSubsidiary(filter)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.subsidiaries.set(resp);
          this.numElementsByPage.set(resp.data.page.numElementsByPage);
          this.filterSubsidiary.set(resp.data.page);
        }
      });
  }

  onPageChange(newPage: any): void {
    this.page = newPage.first / newPage.rows;
    this.size = newPage.rows;
    this.listSubsidiary();
  }

  createEstable(infoEstablecimiento: any) {
    const Subsidiary = this.subsidiaries();
    if (!Subsidiary?.data?.listData) return;

    const updatedSubsidiary = {
      ...Subsidiary,
      data: {
        ...Subsidiary.data,
        listData: [...Subsidiary!.data!.listData!, infoEstablecimiento],
      },
    };

    this.subsidiaries.set(updatedSubsidiary);
  }

  deleteEstable(ideSubsidiary: number): void {
    const Subsidiary = this.subsidiaries();

    if (!Subsidiary?.data?.listData) return;

    const updatedCliente = {
      ...Subsidiary,
      data: {
        ...Subsidiary.data,
        listData: Subsidiary!.data!.listData!.filter((subsidiary: any) => subsidiary.ideSubsidiary !== ideSubsidiary),
      },
    };

    this.subsidiaries.set(updatedCliente);
  }
}
