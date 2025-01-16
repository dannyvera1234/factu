import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: ` <footer class="bg-white p-2 shadow text-center text-sm">
    © {{ year }} Desarrollado por <span class="text-red-500"> Factu EC</span>. Todos los derechos reservados.
  </footer>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  public readonly year = new Date().getFullYear();
}
