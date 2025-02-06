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
import { GeneriResp } from '../../../../interfaces';
import { CurrencyPipe, NgClass, SlicePipe } from '@angular/common';
import { ConfigFacturacionService, NotificationService } from '../../../../utils/services';
import { CustomSelectComponent } from '../../../../components';
import { FormsModule } from '@angular/forms';
import { finalize, mergeMap, of } from 'rxjs';
import { ProveedorService } from '../../../../services/service-empresas';

@Component({
  selector: 'app-details-xml',
  imports: [NgClass, CurrencyPipe, SlicePipe, CustomSelectComponent, FormsModule],
  templateUrl: './details-xml.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsXmlComponent implements OnInit {
  @Input({ required: true }) infoXML!: any;

  @Output() public readonly created = new EventEmitter<GeneriResp<any> | null>();

  public readonly loading = signal(false);

  public readonly tipoProducto = signal<string>('');

  public readonly tipoProduct = computed<{ values: string[]; labels: string[] }>(() => {
    return Object.entries(this.config.CategoriaCostoEnum()).reduce(
      (prev, [value, key]) => {
        prev.labels.push(key);
        prev.values.push(value);

        return prev;
      },
      { values: [] as string[], labels: [] as string[] },
    );
  });

  constructor(
    public readonly config: ConfigFacturacionService,
    private readonly notification: NotificationService,
    private readonly proveedorService: ProveedorService,
  ) {}
  ngOnInit(): void {
  }

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
      data.tarifaIVA = impuestosIVA?.tarifa !== null && impuestosIVA?.tarifa !== undefined ? impuestosIVA?.tarifa + ' %' : '';
      data.valorIVA = impuestosIVA?.valor;
      data.subTotal = impuestosIVA?.baseImponible;
      data.total = impuestosIVA?.baseImponible + impuestosIVA?.valor;
      return {
        ...data,
      };
    });
  });

  copyToClipboard(value: string) {
    navigator.clipboard.writeText(value).then(() => {
      this.notification.push({
        message: 'Clave de acceso copiada al portapapeles',
        type: 'success',
      });
    });
  }

  saveXML() {
    if (this.tipoProducto() === '') {
      this.notification.push({
        message: 'Seleccione un tipo de registro',
        type: 'error',
      });
    }

    const data = {
      ...this.infoXML,
      tipoProducto: this.tipoProducto(),
    };

    console.log(data);
    this.created.emit(data);
    return;
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
