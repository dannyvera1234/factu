import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { of, mergeMap, finalize } from 'rxjs';
import { CustomSelectComponent, ModalComponent } from '@/components';
import { ListClientes, GeneriResp } from '@/interfaces';
import { FormatPhonePipe, TextInitialsPipe } from '@/pipes';
import { ClientesService } from '../../services/service-empresas';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { CreateClienteEmpresaComponent, DeleteClienteEmpresaComponent, FilterComponent } from './components';
import { Modulos } from '../../utils/permissions';
import { ConfigFacturacionService } from '../../utils/services';
import { Tag } from 'primeng/tag';
@Component({
  selector: 'app-clientes',
  imports: [
    ModalComponent,
    FormatPhonePipe,
    TextInitialsPipe,
    NgOptimizedImage,
    CreateClienteEmpresaComponent,
    DeleteClienteEmpresaComponent,
    RouterLink,
    FilterComponent,
    TableModule,
    ButtonModule,
    CustomSelectComponent,
    FormsModule,
    Tag,
  ],
  templateUrl: './clientes.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientesComponent {
  public readonly open = signal<'nombre' | 'Estado Credito' | 'Estado Pago' | null>(null);
  public readonly updateClient = signal<ListClientes | null>(null);
  public readonly listClientes = signal<GeneriResp<any> | null>(null);
  public readonly viewingIdeCustomer = signal<number | null>(null);
  public readonly filterCustomer = signal<any | null>(null);
  public readonly numElementsByPage = signal<number>(0);
  public readonly letterCreditStatus = signal('');
  public readonly idePersona = signal<number>(0);
  public readonly loading = signal(false);
  public readonly credito = signal(null);
  private size = Modulos.PAGE_SIZE;
  public searchQuery = '';
  private page = 0;

  public readonly statusCredito = computed<{ values: string[]; labels: string[] }>(() => {
    return Object.entries(this.config.statusCredito()).reduce(
      (prev, [value, key]) => {
        prev.labels.push(key);
        prev.values.push(value);

        return prev;
      },
      { values: [] as string[], labels: [] as string[] },
    );
  });

  constructor(
    private readonly clienteService: ClientesService,
    private readonly config: ConfigFacturacionService,
  ) {
    this.getListClientes();
  }

  toggleFilter(filterName: 'nombre' | 'Estado Pago' | 'Estado Credito' | null) {
    if (this.open() === filterName) {
      this.open.set(null);
    } else {
      this.open.set(filterName);
    }
  }

  filter() {
    this.open.set(null);
    this.getListClientes();
  }

  getSeverity(status: string): 'success' | 'danger' | undefined {
    switch (status) {
      case 'ATRAZADO':
        return 'danger';

      case 'PENDIENTE':
        return 'success';

      default:
        return undefined;
    }
  }

  onPageChange(newPage: any): void {
    this.page = newPage.first / newPage.rows;
    this.size = newPage.rows;
    this.getListClientes();
  }

  createCliente(create: ListClientes): void {
    if (create) this.getListClientes();
  }

  deleteCliente(ideCustomer: number): void {
    const currentCliente = this.listClientes();

    if (!currentCliente?.data?.listData) return;

    const updatedCliente = {
      ...currentCliente,
      data: {
        ...currentCliente.data,
        listData: currentCliente!.data!.listData!.filter((cliente: any) => cliente.ideCustomer !== ideCustomer),
      },
    };

    this.listClientes.set(updatedCliente);
  }

  getListClientes(): void {
    const filter = {
      page: this.page,
      size: this.size,
      search: this.searchQuery,
      filterModel: {
        hasActiveCredit: this.credito(),
        letterCreditStatus: this.letterCreditStatus(),
      },
    };
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.clienteService.listClientes(filter)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.listClientes.set(resp);
          this.filterCustomer.set(resp.data.page);
          this.numElementsByPage.set(resp.data.page.numElementsByPage);
        }
      });
  }
}
