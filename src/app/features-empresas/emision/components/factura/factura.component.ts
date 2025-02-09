import { ChangeDetectionStrategy, Component, computed, Input, signal } from '@angular/core';
import {
  InfoClienteEmpresaComponent,
  InfoEmpresaComponent,
  InfoProductosComponent,
  ResumenPagoEnpresaComponent,
} from './components';
import { CreateFacturaEmpresaService } from './create-factura-empresa.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-factura',
  imports: [InfoClienteEmpresaComponent, InfoEmpresaComponent, InfoProductosComponent, ResumenPagoEnpresaComponent, NgClass],
  templateUrl: './factura.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturaComponent {
  @Input({ required: true }) valid!: boolean;

  @Input({ required: true }) set editarProforma(value: any) {
    this.config.infoProforma.set(value ? value : null);
  }

  public hasPaymentCode(code: string): boolean {
    return this.config.selectedPaymentMethod()?.some((method) => method.metodoPago?.code === code) || false;
  }

  constructor(public readonly config: CreateFacturaEmpresaService) {}

  public readonly ide = signal<number | null>(null);

  setPersonaRol(event: number) {
    this.ide.set(event);
  }
}
