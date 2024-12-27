import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-info-emisor',
  imports: [FormsModule],
  templateUrl: './info-emisor.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoEmisorComponent {
  isOpen = false;
  searchTerm = '';
  options = ['Santo Domingo', 'Quito', 'Guayaquil', 'Cuenca', 'Ambato'];
  selected: string | null = null;

  filteredOptions() {
    return this.options.filter((option) =>
      option.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectItem(item: string) {
    this.selected = item;
    this.searchTerm = item;
    this.isOpen = false;
  }

  closeDropdown() {
    setTimeout(() => (this.isOpen = false), 200); // Cierra el menú después de un pequeño retraso
  }
}
