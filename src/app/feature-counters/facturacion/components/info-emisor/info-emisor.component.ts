import { ChangeDetectionStrategy, Component, computed, HostListener, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FacturacionService } from '@/services';
import { GeneriResp } from '@/interfaces';
import { CreateFacturacionService } from '../../create-facturacion.service';
import { CustomDatePipe, FormatIdPipe, FormatPhonePipe } from '@/pipes';
import { CustomInputComponent, CustomSelectComponent } from '@/components';
import { delay, finalize, mergeMap, of } from 'rxjs';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { ConfigFacturacionService } from '../../../../utils/services';

@Component({
  selector: 'app-info-emisor',
  imports: [
    FormsModule,
    FormatIdPipe,
    FormatPhonePipe,
    CustomSelectComponent,
    RouterLink,
    CustomDatePipe,
    CustomInputComponent,
    NgClass
  ],
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

  public readonly isEditing = signal(false);

  public readonly isEditingEstabliecimient = signal(false);

  public readonly loading = signal(false);

  public readonly filteredOptions = signal<GeneriResp<any[]> | null>(null);

  public readonly dropdownOpen = signal(false);

  public readonly selectedEmissor = signal<any | null>(null);

  public readonly searchTerm = signal('');

  public readonly getListEstablishment = signal<any[]>([]);

  public readonly loadingCombo = signal(false);

  public readonly transformedEstabliecimient = computed<{ values: number[]; labels: string[] }>(() =>
    this.getListEstablishment().reduce(
      (acc: any, item: any) => {
        acc.values.push(item.code);
        acc.labels.push(item.code);
        return acc;
      },
      { values: [], labels: [] } as { values: number[]; labels: string[] },
    ),
  );

  constructor(
    private readonly facturacionService: FacturacionService,
    public readonly configFactu: CreateFacturacionService,
    public readonly config: ConfigFacturacionService,
  ) {
    this.configFactu.setEmisor.set(null);
    this.configFactu.idePersona.set(0);
    this.getEmisores();
  }

  handleSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.dropdownOpen.set(true);
    this.filterOption();
  }


  filterOption(): void {
    const searchTerm = this.searchTerm();  // Obtén el término de búsqueda

    // Verifica si el término de búsqueda no está vacío
    if (searchTerm) {
      const term = searchTerm.toLowerCase();  // Convertir el término a minúsculas una sola vez

      // Filtra las opciones basadas en el término de búsqueda
      const filtered = this.filteredOptions()?.data.filter((option) => {
        return [
          option.identificationNumber,
          option.socialReason,
          option.names,
          option.lastName
        ].some(field => field?.toLowerCase().includes(term));
      }) ?? [];



      // Actualiza las opciones filtradas
      this.filteredOptions.set({
        data: filtered,
        status: 'OK',
        message: filtered.length > 1 ? 'Búsqueda realizada correctamente' : 'No se encontraron resultados',
      });
    } else {
      // Si el término de búsqueda está vacío, restablece las opciones completas
      this.getEmisores();  // Recarga las opciones completas si no hay búsqueda
    }
  }




  selectOption(emisor: any) {
    this.dropdownOpen.set(false);
    of(this.loading.set(true))
      .pipe(
        delay(500),
        finalize(() => this.loading.set(false)),
      )
      .subscribe(() => {
        this.selectedEmissor.set(emisor);
        this.searchTerm.set('');
        this.configFactu.setEmisor.set(emisor.idePersonaRol);
        this.configFactu.idePersona.set(emisor.idePersona);
        this.configFactu.selectedEstabliecimient.set('');
        this.getListEstablishmentByEmisor(emisor.idePersonaRol);
        this.configFactu.infoEmisor.set({
          identificationNumber: emisor.identificationNumber,
          typeDocument: emisor.typeDocument,
          socialReason: emisor.socialReason,
          address: emisor.address,
          email: emisor.email,
          cellPhone: emisor.cellPhone,
          personaRolIde: emisor.idePersonaRol,
        });
      });
  }

  toggleDropdown() {
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  getEmisores() {
    of(this.loadingCombo.set(true))
      .pipe(
        mergeMap(() => this.facturacionService.getListCountersByEmisor()),
        finalize(() => this.loadingCombo.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.filteredOptions.set(resp);
        }
      });
  }

  getListEstablishmentByEmisor(personaRolIde: number) {
    this.facturacionService.getListEstablishmentByEmisor(personaRolIde).subscribe((resp) => {
      if (resp.status === 'OK') {
        this.getListEstablishment.set(resp.data);
      }
    });
  }

  preventLetters(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.charCode);

    // Solo permite números
    if (!/[0-9]/.test(inputChar)) {
      event.preventDefault();
    }

    // Limitar a 3 dígitos
    if (this.configFactu.pointCode?.length >= 3) {
      event.preventDefault();
    }
  }

  validatePointCode() {
    // Si el campo está vacío, asignar "001" como valor inicial
    if (!this.configFactu.pointCode()) {
      this.configFactu.pointCode.set('001');
    }

    // Si el valor es "000", asignar "001"
    if (this.configFactu.pointCode() === '000' || this.configFactu.pointCode() === '0') {
      this.configFactu.pointCode.set('001');
    }

    // Eliminar ceros iniciales y asegurarse de que el número sea válido
    const numericValue = this.configFactu.pointCode().replace(/^0+/, '');

    // Si el valor ingresado es numérico, incrementamos el valor
    if (numericValue) {
      // Asegurarse de que siempre tenga 3 dígitos, rellenando con ceros si es necesario
      this.configFactu.pointCode.set(numericValue.padStart(3, '0'));
    }
  }
  toggleEdit(type: 'pointOfSale' | 'establishment') {
    if (type === 'pointOfSale') {
      this.isEditing.set(!this.isEditing());
    } else if (type === 'establishment') {
      this.isEditingEstabliecimient.set(!this.isEditingEstabliecimient());
    }
  }

  // Función para guardar cambios
  saveChanges(type: 'pointOfSale' | 'establishment') {
    if (type === 'pointOfSale') {
      this.isEditing.set(false);
      // Lógica para guardar el punto de venta
    } else if (type === 'establishment') {
      this.isEditingEstabliecimient.set(false);
      // Lógica para guardar el establecimiento
    }
  }
}
