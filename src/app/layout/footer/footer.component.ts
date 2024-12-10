import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: ` <footer class="bg-white p-2 shadow text-center text-sm">
    © {{ year }} Desarrollado por factu. Todos los derechos reservados.
  </footer>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  public readonly year = new Date().getFullYear();
}
