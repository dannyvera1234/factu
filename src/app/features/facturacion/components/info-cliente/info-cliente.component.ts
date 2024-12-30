import { ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, signal } from '@angular/core';
import { ModalComponent } from '@/components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateClienteComponent } from './components';
import { NgOptimizedImage } from '@angular/common';
import { FacturacionService } from '@/services';
import { CreateFacturacionService } from '../../create-facturacion.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { GeneriResp } from '../../../../interfaces';
import { FormatIdPipe, FormatPhonePipe } from '@/pipes';

@Component({
  selector: 'app-info-cliente',
  imports: [
    ReactiveFormsModule,
    ModalComponent,
    CreateClienteComponent,
    FormsModule,
    NgOptimizedImage,
    FormatIdPipe,
    FormatPhonePipe,
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
       this.dropdownOpen = false;
     }
   }

  searchTerm: string = '';
  dropdownOpen: boolean = false;
  // selectedCliente: any | null = null;
  selectedEstablishment: string = '';
  // filteredOptions: any[] = [];

  ngOnInit() {
    // this.filteredOptions = this.allEmisores;
  }

  handleSearchChange(event: Event) {
    console.log(event);
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.dropdownOpen = true;
    // this.filterOptions();
  }

  // filterOptions() {
  //   this.filteredOptions = this.allEmisores.filter(
  //     (emisor) =>
  //       emisor.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //       emisor.ruc.toLowerCase().includes(this.searchTerm.toLowerCase()),
  //   );
  // }

  selectOption(emisor: any) {
    this.selectedCliente.set(emisor);
    this.searchTerm = emisor.name;
    // this.selectedEstablishment = emisor.establishments[0];
    this.dropdownOpen = false;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  constructor(
    private readonly facturacionService: FacturacionService,
    private readonly configFactu: CreateFacturacionService,
  ) {
    toObservable(this.persoRolIdEmisor).subscribe((emisor) => {
      if (emisor !== null) {
        this.facturacionService.getListCountersByCliente(emisor).subscribe((resp) => {
          if (resp.status === 'OK') {
            this.filteredOptions.set(resp);
          }
        });
      }
    });
  }

  public readonly persoRolIdEmisor = computed(() => this.configFactu.setEmisor());

  public readonly filteredOptions = signal<GeneriResp<any[]> | null>(null);

  public readonly selectedCliente = signal<any | null>(null);
}
