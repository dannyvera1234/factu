import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
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
export class FacturaComponent  {
  @Input({ required: true }) valid!: boolean;

  @Input({ required: true }) set editarProforma(value: any) {
    if (value) {
      this.config.ideUpdateReporte.set(value.invoiceIde);
      this.infoProforma.set(value);
    }
  }

  public readonly infoProforma = signal<any | null>(null);


  constructor(public readonly config: CreateFacturaEmpresaService) {
    // this.config.ideUpdateReporte.set(this.editarProforma?.invoiceIde);
  }


  public readonly ide = signal<number | null>(null);

  setPersonaRol(event: number) {
    this.ide.set(event);
  }
}
