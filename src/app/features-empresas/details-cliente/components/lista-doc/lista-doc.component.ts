import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-lista-doc',
  imports: [],
  templateUrl: './lista-doc.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaDocComponent {
    @HostListener('document:click', ['$event'])
    onClickOutside(event: MouseEvent): void {
      // Si el clic no es dentro de la tabla o el botón de configuración, cerramos el menú
      const menu = (event.target as HTMLElement).closest('.group');
      if (!menu) {
        this.selectedRow = false;
      }
    }

  showDetails: boolean = false;

  selectedRow: boolean = false;

  action(){
    this.showDetails = !this.showDetails;
  }

  toggleMenu(): void {
    this.selectedRow = !this.selectedRow;
  }

}
