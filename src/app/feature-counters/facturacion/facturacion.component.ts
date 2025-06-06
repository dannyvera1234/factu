import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductosComponent, ResumenPagoComponent } from './components';
import { InfoClienteComponent } from './components/info-cliente/info-cliente.component';
import { InfoEmisorComponent } from './components/info-emisor/info-emisor.component';
import { CreateFacturacionService } from './create-facturacion.service';

@Component({
  selector: 'app-facturacion',
  imports: [ResumenPagoComponent, ProductosComponent, InfoClienteComponent, InfoEmisorComponent],
  templateUrl: './facturacion.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturacionComponent {
constructor(public readonly config: CreateFacturacionService) {}


}
