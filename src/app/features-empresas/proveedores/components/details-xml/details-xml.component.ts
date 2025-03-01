import { routes } from './../../../../app.routes';
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
import { CurrencyPipe } from '@angular/common';
import { ConfigFacturacionService, NotificationService } from '@/utils/services';
import { FormsModule } from '@angular/forms';
import { finalize, mergeMap, of } from 'rxjs';
import { ProveedorService } from '@/services/service-empresas';
import { Router, RouterLink } from '@angular/router';
import { CustomSelectComponent } from '@/components';

@Component({
  selector: 'app-details-xml',
  imports: [FormsModule, CurrencyPipe, FormsModule, RouterLink, CustomSelectComponent],
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

  public readonly dataTypeBuy = '';

  public readonly typeBuy = computed<{ values: string[]; labels: string[] }>(() => {
    return Object.entries(this.config.buyType()).reduce(
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
    private readonly router: Router,
  ) {}

  ngOnInit(): void {}
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (this.isValidFileType(file)) {
        this.fileUrl.set(file);
        this.nameFile.set(file.name);
      } else {
        this.fileUrl.set(null);
        this.notification.push({
          message: 'Tipo de archivo no permitido. Solo se permiten imágenes en formato PNG y JPG.',
          type: 'error',
        });
      }
    }
  }

  private isValidFileType(file: File): boolean {
    const acceptedFileTypes = ['image/png', 'image/jpeg'];
    return acceptedFileTypes.includes(file.type);
  }


  removeLogo(): void {
    this.fileUrl.set(null);
    this.nameFile.set(null);
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
    if (this.dataTypeBuy === '') {
      this.notification.push({
        message: 'Por favor, seleccione un tipo de compra',
        type: 'error',
      });
      return;
    }

    const data = {
      ...this.infoXML,
    };
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.proveedorService.saveXML(data, this.dataTypeBuy, this.fileUrl())),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.created.emit(resp);
          this.showForm.set(false);
          this.notification.push({
            message: 'XML guardado correctamente',
            type: 'success',
          });
          this.router.navigate(['/sistema_contable_empresa/proveedores']);
        }
      });
  }
}
