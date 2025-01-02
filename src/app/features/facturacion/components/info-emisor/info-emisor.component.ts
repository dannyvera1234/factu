import { ChangeDetectionStrategy, Component, computed, HostListener, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FacturacionService } from '@/services';
import { GeneriResp } from '@/interfaces';
import { CreateFacturacionService } from '../../create-facturacion.service';
import { FormatIdPipe, FormatPhonePipe } from '@/pipes';
import { CustomInputComponent, CustomSelectComponent } from '@/components';
import { delay, finalize, mergeMap, of } from 'rxjs';

@Component({
  selector: 'app-info-emisor',
  imports: [FormsModule, FormatIdPipe, FormatPhonePipe, CustomSelectComponent, CustomInputComponent],
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

  public readonly puntoVenta = signal<string>('');

  public readonly loadingCombo = signal(false);

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
    this.configFactu.idePersona.set(0);
    this.getEmisores();
  }

  handleSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.dropdownOpen.set(true);
    this.filteredOptions();
  }

  filterOptions() {}

  selectOption(emisor: any) {
    this.dropdownOpen.set(false);
    of(this.loading.set(true))
      .pipe(
         delay(1000),
        finalize(() => this.loading.set(false)),
      )
      .subscribe(() => {
        this.selectedEmissor.set(emisor);
        this.configFactu.setEmisor.set(emisor.idePersonaRol);
        this.configFactu.idePersona.set(emisor.idePersona);
        this.selectedEstabliecimient.set('');
        this.puntoVenta.set('');
        this.getListEstablishmentByEmisor(emisor.idePersonaRol);
      });
  }

  toggleDropdown() {
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  getEmisores() {
    of(this.loadingCombo.set(true))
      .pipe(
        delay(1000),
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


  public preventLetters(event: KeyboardEvent): void {
    const key = event.key;

    if (!/[\d]/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
}
