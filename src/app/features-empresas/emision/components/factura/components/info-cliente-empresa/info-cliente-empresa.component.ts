import { ChangeDetectionStrategy, Component, computed, HostListener, signal } from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of, delay, finalize } from 'rxjs';
import { GeneriResp } from '@/interfaces';
import { NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalComponent } from '@/components';
import { FormatPhonePipe } from '@/pipes';
import { CreateFacturaEmpresaService } from '../../create-factura-empresa.service';
import { EmisionService } from '@/services/service-empresas/emision.service';
import { CreateClienteEmpresaComponent } from '../../../../../configuracion/components/lista-clientes-empresa/components';
import { consumidorFinal } from '@/interfaces/common/constante';

@Component({
  selector: 'app-info-cliente-empresa',
  imports: [
    ReactiveFormsModule,
    ModalComponent,
    FormsModule,
    NgOptimizedImage,
    FormatPhonePipe,
    CreateClienteEmpresaComponent,
  ],
  templateUrl: './info-cliente-empresa.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoClienteEmpresaComponent {
  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent): void {
    const dropdownContainer = document.querySelector('.dropdown');
    if (!dropdownContainer?.contains(event.target as Node)) {
      this.dropdownOpen.set(false);
    }
  }
  public readonly loading = signal(false);
  public readonly dropdownOpen = signal(false);
  public readonly loadingCombo = signal(false);
  public readonly persoRolIdEmisor = computed(() => this.configFactu.setEmisor());
  public readonly filteredOptions = signal<GeneriResp<any[]> | null>(null);
  public readonly selectedCliente = signal<any | null>(null);
  public readonly previousEmisor = signal<number>(0);
  public readonly searchTerm = signal('');

  // Variable para almacenar las opciones originales
  private originalOptions: GeneriResp<any[]> | null = null;

  handleSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.dropdownOpen.set(true);
    this.filterOption();
  }

  filterOption(): void {
    const searchTerm = this.searchTerm(); // Obtén el término de búsqueda

    // Si hay término de búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase(); // Convertir el término a minúsculas solo una vez

      // Filtra las opciones basadas en el término de búsqueda
      const filtered =
        this.originalOptions?.data.filter((option) => {
          return [option.identificationNumber, option.socialReason, option.names, option.lastName].some((field) =>
            field?.toLowerCase().includes(term),
          );
        }) ?? [];

      // Actualiza las opciones filtradas solo si cambian
      const message = filtered.length > 1 ? 'Búsqueda realizada correctamente' : 'No se encontraron resultados';
      this.filteredOptions.set({
        data: filtered,
        status: 'OK',
        message,
      });
    } else {
      // Si el término de búsqueda está vacío, restablece las opciones a las originales
      if (this.originalOptions) {
        this.filteredOptions.set(this.originalOptions);
      }
    }
  }

  selectOption(cliente: any) {
    this.dropdownOpen.set(false);
    this.loading.set(true);

    of(null)
      .pipe(
        delay(500),
        finalize(() => this.loading.set(false)),
      )
      .subscribe(() => {
        this.selectedCliente.set(cliente);
        this.dropdownOpen.set(false);
        this.configFactu.infoCustomer.set({
          identificationNumber: cliente.identificationNumber,
          typeDocument: cliente.typeDocument,
          socialReason: `${cliente.names} ${cliente.lastName}`,
          address: cliente.address,
          email: cliente.email,
          cellPhone: cliente.cellPhone,
          customerIde: cliente.idePersona,
        });
      });
  }

  toggleDropdown() {
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  constructor(
    private readonly emisionService: EmisionService,
    public readonly configFactu: CreateFacturaEmpresaService,
  ) {
    toObservable(this.persoRolIdEmisor)
      .pipe(takeUntilDestroyed())
      .subscribe((emisor) => {
        if (emisor !== null && this.previousEmisor() !== emisor) {
          this.selectedCliente.set(null);
        }
        this.previousEmisor.set(emisor || 0);

        if (emisor !== null) {
          this.emisionService.listCustomer(emisor).subscribe((resp) => {
            if (resp.status === 'OK') {
              resp.data.unshift(consumidorFinal);
              this.originalOptions = resp; // Guardamos las opciones originales
              this.filteredOptions.set(resp);
            }
          });
        }
      });
  }

  createCliente(event: any) {
    if (event.status === 'OK') {
      this.emisionService.listCustomer(this.previousEmisor()).subscribe((resp) => {
        if (resp.status === 'OK') {
          resp.data.unshift(consumidorFinal);
          this.originalOptions = resp; // Guardamos las opciones originales nuevamente
          this.filteredOptions.set(resp);
        }
      });
    }
  }
}
