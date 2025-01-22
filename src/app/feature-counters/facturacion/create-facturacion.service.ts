import { Injectable, signal } from '@angular/core';
import { DetailsProducto } from '../../interfaces';
import { NotificationService } from '../../utils/services';
import { FacturacionService } from '../../services';
import { finalize, mergeMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreateFacturacionService {
  public readonly loading = signal(false);

  public readonly setEmisor = signal<number | null>(null);

  public readonly idePersona = signal<number>(0);

  public readonly infoEmisor = signal<any | null>(null);

  public pointCode = signal<string>('001');

  public readonly infoCustomer = signal<any | null>(null);

  public readonly products = signal<any[]>([]);

  public readonly selectedEstabliecimient = signal('');

  public readonly detailProducts = signal<DetailsProducto[] | null>([]);

  public readonly selectedPaymentMethod = signal<any | null>('');

  public readonly infoVoucherReqDTO = signal<any | null>(null);

  constructor(
    private readonly notification: NotificationService,
    private readonly facturacionService: FacturacionService,
  ) {}

  submit() {
    // Obtener la información del emisor, cliente y método de pago seleccionado
    const infoEmisor = this.infoEmisor();
    const infoCustomer = this.infoCustomer();
    const selectedPaymentMethod = this.selectedPaymentMethod();

    // Verificar si hay productos disponibles
    if (this.products()?.length === 0) {
      this.notification.push({
        message: 'No hay productos disponibles para registrar la venta',
        type: 'error',
      });
      return;
    }

    if(infoCustomer.identificationNumber === '9999999999999' && this.infoVoucherReqDTO().importeTotal > 50){
      this.notification.push({
        message: 'No se puede realizar una factura con valor mayor a $50.00 para consumidor final',
        type: 'error',
      });
      return;
    }

    // Verificar si todos los campos obligatorios están completos
    if (
      !infoEmisor ||
      !infoCustomer ||
      !selectedPaymentMethod ||
      !this.selectedEstabliecimient() ||
      !this.pointCode()
    ) {
      this.notification.push({
        message: 'Por favor, complete todos los campos obligatorios',
        type: 'error',
      });
      return;
    }

    // Obtener la fecha de emisión y formatearla como YYYY-MM-DD
    const emissionDate = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Guayaquil', // Quito usa esta zona horaria (GMT-5)
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(emissionDate);

    // Preparar los datos de facturación
    const dataFacturacion = {
      infoEmisor: {
        identificationNumber: infoEmisor.identificationNumber,
        typeDocument: infoEmisor.typeDocument,
        socialReason: infoEmisor.socialReason,
        mainAddress: infoEmisor.address,
        email: infoEmisor.email,
        cellPhone: infoEmisor.cellPhone,
        personaRolIde: infoEmisor.personaRolIde,
      },
      infoCustomer: {
        identificationNumber: infoCustomer.identificationNumber,
        typeDocument: infoCustomer.typeDocument,
        socialReason: infoCustomer.socialReason,
        mainAddress: infoCustomer.address,
        email: infoCustomer.email,
        cellPhone: infoCustomer.cellPhone,
        customerIde: infoCustomer.customerIde,
      },
      infoSubsidiaryReqDTO: {
        establishmentCode: this.selectedEstabliecimient(),
        pointCode: this.pointCode(),
        address: infoEmisor.address,
      },
      infoInvoiceReqDTO: {
        documentType: '01',
        documentTypeDesc: 'Factura',
        emissionDate: formattedDate,
      },
      detailProducts: this.detailProducts()?.map((product) => ({
        productIde: product.ide,
        mainCode: product.mainCode,
        auxilaryCode: product.auxiliaryCode,
        name: product.name,
        description: product.description,
        productType: product.productType,
        amount: product.cantidad,
        unitPrice: product.unitPrice,
        tariffCodeIva: product.tariffCodeIva,
        tariffIva: product.tariffIva,
        tariffDesIva: product.tariffDesIva,
        valueIva: product.valorIVA,
        tariffCodeIce: product.tariffCodeIce,
        tariffAdValoremIce: product.tariffAdValoremIce,
        tariffSpecificIce: product.tariffSpecificIce,
        tariffDesICE: product.tariffDesICE,
        valueIce: product.valorICE || 0,
        subtotal: product.subTotal,
        total: product.valorTotal,
      })),
      paysForms: [
        {
          code: selectedPaymentMethod.code,
          description: selectedPaymentMethod.description,
          total: this.infoVoucherReqDTO().importeTotal,
          timeUnit: 'dias',
          plazo: '0',
        },
      ],
      infoVoucherReqDTO: {
        taxes: this.infoVoucherReqDTO().inpuestoIva.values.map((iva: any) => ({
          codeTaxType: '2',
          tariffCode: iva.key,
          tariffValue: iva.tariffValue,
          description: iva.label,
          imponibleBase: iva.value,
        })),
        totalSinImpuestos: this.infoVoucherReqDTO().totalSinImpuestos,
        totalDescuento: 0,
        valorIva: this.infoVoucherReqDTO().valorIva,
        valorIce: this.infoVoucherReqDTO().valorIce,
        propina: 0,
        importeTotal: this.infoVoucherReqDTO().importeTotal,
      },
      observation: null,
    };

    // Mostrar el cargador mientras se procesa la factura
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.facturacionService.generateInvoice(dataFacturacion)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe(
        (response) => {
          if (response.status === 'OK') {
            this.notification.push({
              message: 'Factura generada correctamente',
              type: 'success',
            });
            this.selectedPaymentMethod.set('');
          } else {
            this.notification.push({
              message: 'Error al generar la factura. Intente nuevamente.',
              type: 'error',
            });
          }
        },
        (error) => {
          this.notification.push({
            message: 'Ocurrió un error inesperado.',
            type: 'error',
          });
        }
      );
  }
}

