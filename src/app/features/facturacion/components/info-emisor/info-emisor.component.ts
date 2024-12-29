import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-info-emisor',
  imports: [FormsModule],
  templateUrl: './info-emisor.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoEmisorComponent {
  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent): void {
    const dropdownContainer = document.querySelector('.dropdown-container');
    if (!dropdownContainer?.contains(event.target as Node)) {
      this.dropdownOpen = false;
    }
  }

  searchTerm: string = '';
  dropdownOpen: boolean = false;
  selectedEmissor: any | null = null;
  selectedEstablishment: string = '';
  filteredOptions: any[] = [];

  allEmisores: any[] = [
    {
      id: '1',
      name: 'Empresa A',
      ruc: 'EMA123456ABC',
      address: 'Calle 123, Ciudad de México',
      email: 'contacto@empresaa.com',
      establishments: ['Sucursal Principal', 'Sucursal Norte', 'Sucursal Sur'],
      logo: '/placeholder.svg?height=100&width=100'
    },
    {
      id: '2',
      name: 'Corporación B',
      ruc: 'COB789012DEF',
      address: 'Av. Principal 456, Guadalajara',
      email: 'info@corporacionb.com',
      establishments: ['Oficina Central', 'Centro de Distribución', 'Tienda Online'],
      logo: '/placeholder.svg?height=100&width=100'
    },
    {
      id: '3',
      name: 'Industrias C',
      ruc: 'INC345678GHI',
      address: 'Blvd. Industrial 789, Monterrey',
      email: 'ventas@industriasc.com',
      establishments: ['Planta de Producción', 'Centro de Investigación', 'Showroom'],
      logo: '/placeholder.svg?height=100&width=100'
    },
  ];

  ngOnInit() {
    this.filteredOptions = this.allEmisores;
  }

  handleSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.dropdownOpen = true;
    this.filterOptions();
  }

  filterOptions() {
    this.filteredOptions = this.allEmisores.filter(emisor =>
      emisor.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      emisor.ruc.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectOption(emisor: any) {
    this.selectedEmissor = emisor;
    this.searchTerm = emisor.name;
    this.selectedEstablishment = emisor.establishments[0];
    this.dropdownOpen = false;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }



}

