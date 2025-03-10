import { ChangeDetectionStrategy, Component, computed, Input, signal } from '@angular/core';
import {
  ComprobantePagoComponent,
  FormaPagoComponent,
  InfoClienteEmpresaComponent,
  InfoEmpresaComponent,
  InfoProductosComponent,
  ResumenPagoEnpresaComponent,
} from './components';
import { CreateFacturaEmpresaService } from './create-factura-empresa.service';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { ModalComponent } from '../../../../components';
import { ListaProductosComponent } from './components/info-productos/components';
import { AddPaymentComponent } from './components/forma-pago/components';

@Component({
  selector: 'app-factura',
  imports: [
    InfoClienteEmpresaComponent,
    InfoEmpresaComponent,
    InfoProductosComponent,
    ResumenPagoEnpresaComponent,
    NgClass,
    FormaPagoComponent,
    ComprobantePagoComponent,
    ModalComponent,
    ListaProductosComponent,
    NgOptimizedImage,
    AddPaymentComponent,
  ],
  templateUrl: './factura.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturaComponent {
  @Input({ required: true }) valid!: boolean;

  @Input({ required: true }) set editarProforma(value: any) {
    this.config.infoProforma.set(value ? value : null);
  }

  // public readonly addPayments = signal<any | null>(null);
  public readonly setPersonaRol = signal<number | null>(null);

  constructor(public readonly config: CreateFacturaEmpresaService) {}

  public hasPaymentCode(code: string): boolean {
    return this.config.selectedPaymentMethod()?.some((method) => method.metodoPago?.code === code) || false;
  }

  public readonly calculateTotal = computed(() => {
    return this.config
      .detailProducts()
      ?.map((product) => ({ ...product }))
      .reduce((acc, product) => acc + product.valorTotal, 0);
  });
}
