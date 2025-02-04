import { ChangeDetectionStrategy, Component, HostListener, Input, signal } from '@angular/core';
import { of, delay, finalize } from 'rxjs';
import { GeneriResp } from '@/interfaces';
import { NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalComponent } from '@/components';
import { FormatPhonePipe } from '@/pipes';
import { CreateFacturaEmpresaService } from '../../create-factura-empresa.service';
import { EmisionService } from '@/services/service-empresas/emision.service';
import { consumidorFinal } from '@/interfaces/common/constante';
import { CreateClienteComponent } from './components';

@Component({
  selector: 'app-info-cliente-empresa',
  imports: [
    ReactiveFormsModule,
    ModalComponent,
    FormsModule,
    NgOptimizedImage,
    FormatPhonePipe,
    CreateClienteComponent,
  ],
  templateUrl: './info-cliente-empresa.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoClienteEmpresaComponent {
  @Input({ required: true }) set proformaCliente(value: any) {
    if (value !== null) {
      this.selectedCliente.set({
        address: value.mainAddress,
        names: value.socialReason,
        lastName: '',
        ...value,
      });
      this.configFactu.infoCustomer.set({
        ...value,
        address: value.mainAddress,
        names: value.socialReason,
        lastName: '',
      });
    }
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent): void {
    const dropdownContainer = document.querySelector('.dropdown');
    if (!dropdownContainer?.contains(event.target as Node)) {
      this.dropdownOpen.set(false);
    }
  }

  @Input({ required: true })set setPersonaRol(value: any) {
    if (value !== null) {
       this.idePersonal.set(value);
    }
  }
  public readonly idePersonal = signal<number | null>(null);
  public readonly loading = signal(false);
  public readonly dropdownOpen = signal(false);
  public readonly loadingCombo = signal(false);
  public readonly filteredOptions = signal<GeneriResp<any> | null>(null);
  public readonly selectedCliente = signal<any | null>(null);
  public  searchTerm = '';

  // Variable para almacenar las opciones originales
  private originalOptions: GeneriResp<any[]> | null = null;

  handleSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.dropdownOpen.set(true);
    this.getCustomer();
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
  ) {}

  getCustomer() {
    this.dropdownOpen.set(true);
    if (this.filteredOptions() === null || this.filteredOptions() === undefined) {
      this.emisionService.listCustomer(this.idePersonal()!, this.searchTerm, 0).subscribe((resp) => {
        if (resp.status === 'OK') {
          console.log(resp);
           resp.data.listData.unshift(consumidorFinal);
          this.originalOptions = resp;
          this.filteredOptions.set(resp);
        }
      });
    }
  }

  createCliente(event: any) {
    if (event.status === 'OK') {
      this.emisionService.listCustomer(this.idePersonal()!, this.searchTerm, 0).subscribe((resp) => {
        if (resp.status === 'OK') {
          resp.data.unshift(consumidorFinal);
          this.originalOptions = resp;
          this.filteredOptions.set(resp);
        }
      });
    }
  }
}
