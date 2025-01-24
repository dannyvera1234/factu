import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  InfoClienteEmpresaComponent,
  InfoEmpresaComponent,
  InfoProductosComponent,
  ResumenPagoEnpresaComponent,
} from './components';
import { CreateFacturaEmpresaService } from './create-factura-empresa.service';

@Component({
  selector: 'app-factura',
  imports: [InfoClienteEmpresaComponent, InfoEmpresaComponent, InfoProductosComponent, ResumenPagoEnpresaComponent],
  templateUrl: './factura.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturaComponent {
  constructor(public readonly config: CreateFacturaEmpresaService) {}

  public readonly ide = signal<number | null>(null);

  setPersonaRol(event: number) {
    this.ide.set(event);
  }
}
