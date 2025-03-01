import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { GeneriResp } from '@/interfaces';
import { CurrencyPipe, NgClass } from '@angular/common';
import { ConfigFacturacionService, NotificationService } from '@/utils/services';
import { FormsModule } from '@angular/forms';
import { finalize, mergeMap, of } from 'rxjs';
import { ProveedorService } from '@/services/service-empresas';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-details-xml',
  imports: [NgClass, CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './details-xml.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsXmlComponent implements OnInit {
  @Input({ required: true }) infoXML!: any;

  @Output() public readonly created = new EventEmitter<GeneriResp<any> | null>();

  public readonly showForm = signal(false);

  public readonly loading = signal(false);

  public readonly tipoProducto = signal<string>('');

  public readonly fileUrl = signal<any | null>(null);

  public readonly nameFile = signal<string | null>(null);

  constructor(
    public readonly config: ConfigFacturacionService,
    private readonly notification: NotificationService,
    private readonly proveedorService: ProveedorService,
  ) {}

  ngOnInit(): void {}

  public readonly listaDetalle = computed(() => {
    return this.infoXML?.detalles.detalle?.map((detalle: any) => {
      const data: any = {
        cantidad: detalle.cantidad,
        codigoPrincipal: detalle.codigoPrincipal,
        codigoAuxiliar: detalle.codigoAuxiliar,
        descripcion: detalle.descripcion,
        precioTotalSinImpuesto: detalle.precioTotalSinImpuesto,
        precioUnitario: detalle.precioUnitario,
      };

      const impuestosIVA = detalle.impuestos?.impuesto?.find((impuesto: any) => impuesto.codigo === '2');
      data.tarifaIVA =
        impuestosIVA?.tarifa !== null && impuestosIVA?.tarifa !== undefined ? impuestosIVA?.tarifa + ' %' : '';
      data.valorIVA = impuestosIVA?.valor;
      data.subTotal = impuestosIVA?.baseImponible;
      data.total = impuestosIVA?.baseImponible + impuestosIVA?.valor;

      return {
        ...data,
      };
    });
  });

  saveXML() {
    const data = {
      ...this.infoXML,
    };
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.proveedorService.saveXML(data)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.created.emit(resp);
          this.notification.push({
            message: 'XML guardado correctamente',
            type: 'success',
          });
        }
      });
  }
}
