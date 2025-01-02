import { ChangeDetectionStrategy, Component, computed, HostListener, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FacturacionService } from '@/services';
import { GeneriResp } from '@/interfaces';
import { CreateFacturacionService } from '../../create-facturacion.service';
import { FormatIdPipe, FormatPhonePipe } from '@/pipes';
import { CustomSelectComponent } from '@/components';
import { delay, finalize, of } from 'rxjs';

@Component({
  selector: 'app-info-emisor',
  imports: [FormsModule, FormatIdPipe, FormatPhonePipe, CustomSelectComponent],
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

  public readonly loading = signal(false);

  public readonly filteredOptions = signal<GeneriResp<any[]> | null>(null);

  public readonly dropdownOpen = signal(false);

  public readonly selectedEmissor = signal<any | null>(null);

  public readonly searchTerm = signal('');

  public readonly selectedEstabliecimient = signal('');

  public readonly getListEstablishment = signal<any[]>([]);

  public readonly transformedEstabliecimient = computed<{ values: number[]; labels: string[] }>(() =>
    this.getListEstablishment().reduce(
      (acc: any, item: any) => {
        acc.values.push(item.ideSubsidiary);
        acc.labels.push(item.code);
        return acc;
      },
      { values: [], labels: [] } as { values: number[]; labels: string[] },
    ),
  );

  constructor(
    private readonly facturacionService: FacturacionService,
    private readonly configFactu: CreateFacturacionService,
  ) {
    this.configFactu.setEmisor.set(null);
    this.getEmisores();
  }

  handleSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.dropdownOpen.set(true);
    this.filteredOptions();
  }

  filterOptions() {
    // const searchTermLower = this.searchTerm().toLowerCase();
    // if (this.filteredOptions()?.data) {
    //   const filtered = this.filteredOptions().data.filter(
    //     (emisor) =>
    //       emisor.names.toLowerCase().includes(searchTermLower) ||
    //       emisor.identificationNumber.toLowerCase().includes(searchTermLower),
    //   );
    //   this.filteredOptions.set({ ...this.filteredOptions(), data: filtered });
    // }
  }

  selectOption(emisor: any) {
    of(this.loading.set(true))
      .pipe(
        delay(1000),
        finalize(() => this.loading.set(false)))
      .subscribe(() => {
        this.selectedEmissor.set(emisor);
        this.configFactu.setEmisor.set(emisor.idePersonaRol);
        this.getListEstablishmentByEmisor(emisor.idePersonaRol);
        this.dropdownOpen.set(false);
      });

    // this.selectedEmissor.set(emisor);
    // this.configFactu.setEmisor.set(emisor.idePersonaRol);
    // this.getListEstablishmentByEmisor(emisor.idePersonaRol);
    // this.dropdownOpen.set(false);
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

  getListEstablishmentByEmisor(personaRolIde: number) {
    this.facturacionService.getListEstablishmentByEmisor(personaRolIde).subscribe((resp) => {
      if (resp.status === 'OK') {
        this.getListEstablishment.set(resp.data);
        console.log(resp);
      }
    });
  }
}
