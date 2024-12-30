import { ChangeDetectionStrategy, Component, HostListener, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FacturacionService } from '@/services';
import { GeneriResp } from '../../../../interfaces';

@Component({
  selector: 'app-info-emisor',
  imports: [FormsModule],
  templateUrl: './info-emisor.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoEmisorComponent {
  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent): void {
    const dropdownContainer = document.querySelector('.dropdown-container');
    if (!dropdownContainer?.contains(event.target as Node)) {
      this.dropdownOpen.set(false);
    }
  }

  selectedEstablishment: string = '';

  // Signal para opciones filtradas
  public readonly filteredOptions = signal<GeneriResp<any[]> | null>(null);

  public readonly dropdownOpen = signal(false);

  public readonly selectedEmissor = signal<any | null>(null);

  public readonly searchTerm = signal('');

  constructor(private readonly facturacionService: FacturacionService) {
    this.getEmisores();
  }


  handleSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.dropdownOpen.set(true);
    this.filteredOptions();
  }

  //  filterOptions() {
  //    const searchTermLower = this.searchTerm().toLowerCase();

  //   const filtered = this.emisores()?.data
  //     .filter(
  //       (emisor) =>
  //         emisor.names.toLowerCase().includes(searchTermLower) ||
  //         emisor.identificationNumber.toLowerCase().includes(searchTermLower)
  //     );

  //  }

  selectOption(emisor: any) {
    this.selectedEmissor.set(emisor);

    // this.searchTerm.set(emisor.names + ' ' + emisor.lastName );
     this.dropdownOpen.set(false);
  }

  toggleDropdown() {
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  getEmisores() {
    this.facturacionService.getListCountersByEmisor().subscribe((resp) => {
      if (resp.status === 'OK') {
        this.filteredOptions.set(resp);
      }
    });
  }
}
