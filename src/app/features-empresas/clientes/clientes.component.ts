import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomSelectComponent } from '@/components';
import { ListClientes } from '@/interfaces';
import { FormatPhonePipe, TextInitialsPipe } from '@/pipes';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { CreateClienteEmpresaComponent, DeleteClienteEmpresaComponent, FilterComponent } from './components';
import { Modulos } from '../../utils/permissions';
import { ConfigFacturacionService } from '../../utils/services';
import { Tag } from 'primeng/tag';
import { CLIENTE_INITIAL_STATE } from './store';
@Component({
  selector: 'app-clientes',
  imports: [
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
  public readonly letterCreditStatus = signal('');
  public readonly idePersona = signal<number>(0);
  public readonly credito = signal(null);
  public size: number = Modulos.PAGE_SIZE;
  public searchQuery = '';
  private page = 0;

  clienteStore = inject(CLIENTE_INITIAL_STATE);

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

  constructor(private readonly config: ConfigFacturacionService) {
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

    this.clienteStore.listCustom(filter);
  }
}
