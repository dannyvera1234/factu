import { Injectable, signal } from '@angular/core';
import { of, mergeMap, finalize } from 'rxjs';
import { NotificationService } from '@/utils/services';
import { DetailsProducto } from '@/interfaces';
import { DocumentosService } from '@/services/service-empresas';

@Injectable({
  providedIn: 'root',
})
export class CreateFacturaEmpresaService {
  public readonly loading = signal(false);

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
    private readonly facturacionService: DocumentosService,
  ) {}

  public readonly saveDataFactura = signal(false);

  /**
   * Guarda los datos de la factura
   * Verifica si hay productos disponibles, si todos los campos obligatorios están completos
   * y si el consumidor final no puede tener una factura con valor mayor a $50.00
   */
  saveDatos() {
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

    // Verificar si el consumidor final puede tener una factura con valor mayor a $50.00
    if (infoCustomer.identificationNumber === '9999999999999' && this.infoVoucherReqDTO().importeTotal > 50) {
      this.notification.push({
        message: 'No se puede realizar una factura con valor mayor a $50.00 para consumidor final',
        type: 'error',
      });
      return;
    }
    // Si todo está bien, guardar los datos de la factura
    this.saveDataFactura.set(true);
  }

  /**
   * Obtiene la información de la factura con los datos del emisor,
   * cliente, método de pago y productos seleccionados.
   * @returns La información de la factura en formato JSON.
   */
  infoDataFactura(): any {
    // Obtener la información del emisor, cliente y método de pago seleccionado
    const infoEmisor = this.infoEmisor();
    const infoCustomer = this.infoCustomer();
    const selectedPaymentMethod = this.selectedPaymentMethod();

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
        // personaRolIde: infoEmisor.personaRolIde,
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
        address: infoEmisor.mainAddress,
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

    return dataFacturacion;
  }
  /**
   * Guarda la factura en el servidor como proforma o como factura según sea
   * especificado.
   * @param type Tipo de documento a guardar. Puede ser 'proforma' o 'factura'.
   */
  saveDocument(type: 'proforma' | 'factura') {
    const dataFacturacion = this.infoDataFactura();
    const serviceCall =
      type === 'proforma'
        ? this.facturacionService.generateProforma(dataFacturacion)
        : this.facturacionService.generateInvoice(dataFacturacion);

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => serviceCall),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((response) => {
        if (response.status === 'OK') {
          this.saveDataFactura.set(false);
          this.selectedEstabliecimient.set('');
          this.selectedPaymentMethod.set('');
          this.notification.push({
            message: `La ${type} ha sido generada con éxito.`,
            type: 'info',
          });
        } else {
          this.notification.push({
            message: `Error al generar la ${type}. Intente nuevamente.`,
            type: 'error',
          });
        }
      });
  }
}
