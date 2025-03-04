import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ModalComponent } from '@/components';
import { of, mergeMap, finalize } from 'rxjs';
import { ListClientes, GeneriResp } from '@/interfaces';
import { ProveedorService } from '../../services/service-empresas';
import { FormatIdPipe, TextInitialsPipe } from '@/pipes';
import { NgOptimizedImage } from '@angular/common';
import { AgregarProveedorComponent } from './components';
import { Modulos } from '../../utils/permissions';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-proveedores',
  imports: [
    ModalComponent,
    TextInitialsPipe,
    FormatIdPipe,
    NgOptimizedImage,
    AgregarProveedorComponent,
    RouterLink,
    ButtonModule,
    TableModule,
    FormsModule,
  ],
  templateUrl: './proveedores.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProveedoresComponent {
  public readonly listProveedor = signal<GeneriResp<any> | null>(null);
  public readonly updateClient = signal<ListClientes | null>(null);
  public readonly viewingIdeCustomer = signal<number | null>(null);
  public readonly filterProveedor = signal<any | null>(null);
  public readonly numElementsByPage = signal<number>(0);
  public readonly infoXML = signal<any | null>(null);
  public readonly idePersona = signal<number>(0);
  public readonly loading = signal(false);
  private size = Modulos.PAGE_SIZE;
  public searchQuery = '';
  private page = 0;

  constructor(private readonly proveedorService: ProveedorService) {
    this.getListProveedor();
  }

  getListProveedor(): void {
    const filter = {
      page: this.page,
      size: this.size,
      apply: true,
      search: this.searchQuery,
    };

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.proveedorService.listaProveedor(filter)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.listProveedor.set(resp);
          this.numElementsByPage.set(resp.data.page.numElementsByPage);
          this.filterProveedor.set(resp.data.page);
        }
      });
  }

  onPageChange(newPage: any): void {
    this.page = newPage.first / newPage.rows;
    this.size = newPage.rows;
    this.getListProveedor();
  }

  addProveedor(data: any) {
    const currentProveedor = this.listProveedor();

    if (!currentProveedor?.data?.listData) return;

    const updatedProveedor = {
      ...currentProveedor,
      data: {
        ...currentProveedor.data,
        listData: [...currentProveedor.data.listData, data],
      },
    };

    this.listProveedor.set(updatedProveedor);
  }
}
