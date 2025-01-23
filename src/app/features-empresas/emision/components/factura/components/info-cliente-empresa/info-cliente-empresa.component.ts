import { ChangeDetectionStrategy, Component, computed, HostListener, signal } from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of, delay, finalize } from 'rxjs';
import { GeneriResp } from '@/interfaces';
import { NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalComponent } from '@/components';
import { FormatIdPipe, FormatPhonePipe } from '@/pipes';
import { CreateFacturaEmpresaService } from '../../create-factura-empresa.service';
import { EmisionService } from '@/services/service-empresas/emision.service';

@Component({
  selector: 'app-info-cliente-empresa',
  imports: [ReactiveFormsModule, ModalComponent, FormsModule, NgOptimizedImage, FormatIdPipe, FormatPhonePipe],
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

  handleSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.dropdownOpen.set(true);
  }

  selectOption(cliente: any) {
    this.dropdownOpen.set(false);
    of(this.loading.set(true))
      .pipe(
        delay(500),
        finalize(() => this.loading.set(false)),
      )
      .subscribe(() => {
        this.selectedCliente.set(cliente);
        this.dropdownOpen.set(false);
        // this.configFactu.infoCustomer.set({
        //   identificationNumber: cliente.identificationNumber,
        //   typeDocument: cliente.typeDocument,
        //   socialReason: cliente.names + ' ' + cliente.lastName,
        //   address: cliente.address,
        //   email: cliente.email,
        //   cellPhone: cliente.cellPhone,
        //   customerIde: cliente.idePersona,
        // });
      });
  }

  toggleDropdown() {
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  constructor(
    private readonly emisionService: EmisionService,
    public readonly configFactu: CreateFacturaEmpresaService
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
              const consumidorFinal = {
                names: 'CONSUMIDOR',
                lastName: 'FINAL',
                identificationNumber: '9999999999999',
                typeDocument: '07',
                socialReason: 'CONSUMIDOR FINAL',
                address: 'Santo Domingo',
                email: 'manuelcarrillopenuela51@gmail.com',
                cellPhone: '9999999999',
                idePersona: 0,
                customerIde: -1,
              };
              resp.data.unshift(consumidorFinal);
              this.filteredOptions.set(resp);
            }
          });
        }
      });
  }

  createClient(event: any) {
    // if (event.status === 'OK') {
    //   this.facturacionService.getListCountersByCliente(this.previousEmisor()).subscribe((resp) => {
    //     if (resp.status === 'OK') {
    //       this.filteredOptions.set(resp);
    //     }
    //   });
    // }
  }
}
