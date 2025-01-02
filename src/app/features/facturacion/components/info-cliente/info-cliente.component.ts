import { ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, signal } from '@angular/core';
import { ModalComponent } from '@/components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { FacturacionService } from '@/services';
import { CreateFacturacionService } from '../../create-facturacion.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { GeneriResp } from '@/interfaces';
import { FormatIdPipe, FormatPhonePipe } from '@/pipes';
import { delay, finalize, of } from 'rxjs';
import { CreateClienteComponent } from '../../../details-counter-application/components';

@Component({
  selector: 'app-info-cliente',
  imports: [
    ReactiveFormsModule,
    ModalComponent,
    FormsModule,
    NgOptimizedImage,
    FormatIdPipe,
    FormatPhonePipe,
    CreateClienteComponent,
  ],
  templateUrl: './info-cliente.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoClienteComponent {
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

  searchTerm: string = '';

  handleSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.dropdownOpen.set(true);
    // this.filterOptions();
  }

  // filterOptions() {
  //   this.filteredOptions = this.allEmisores.filter(
  //     (emisor) =>
  //       emisor.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //       emisor.ruc.toLowerCase().includes(this.searchTerm.toLowerCase()),
  //   );
  // }

  selectOption(cliente: any) {
    this.dropdownOpen.set(false);
    of(this.loading.set(true))
      .pipe(
        delay(1000),
        finalize(() => this.loading.set(false)),
      )
      .subscribe(() => {
        this.selectedCliente.set(cliente);
        this.dropdownOpen.set(false);
        this.configFactu.infoCustomer.set({
          identification: cliente.identification,
          typeDocument: cliente.typeDocument,
          socialReason: cliente.socialReason,
          mainAddress: cliente.address,
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
    private readonly facturacionService: FacturacionService,
    public readonly configFactu: CreateFacturacionService,
  ) {
    toObservable(this.persoRolIdEmisor)
      .pipe(takeUntilDestroyed())
      .subscribe((emisor) => {
        if (emisor !== null && this.previousEmisor() !== emisor) {
          this.selectedCliente.set(null);
        }
        this.previousEmisor.set(emisor || 0);

        if (emisor !== null) {
          this.facturacionService.getListCountersByCliente(emisor).subscribe((resp) => {
            if (resp.status === 'OK') {
              this.filteredOptions.set(resp);
            }
          });
        }
      });
  }

  createClient(event: any) {
    if (event.status === 'OK') {
      this.facturacionService.getListCountersByCliente(this.previousEmisor()).subscribe((resp) => {
        if (resp.status === 'OK') {
          this.filteredOptions.set(resp);
        }
      });
    }
  }
}
