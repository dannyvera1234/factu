import { Injectable, signal } from '@angular/core';
import { of, mergeMap, finalize } from 'rxjs';
import { NotificationService } from '@/utils/services';
import { DetailsProducto } from '@/interfaces';
import { DocumentosService } from '@/services/service-empresas';
import { Router } from '@angular/router';

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

  public readonly selectedPaymentMethod = signal<any[] | null>(null);

  public readonly infoVoucherReqDTO = signal<any | null>(null);

  public readonly infoProforma = signal<any | null>(null);

  public readonly observation = signal<string | null>(null);

  public modalMessage = '';

  public actionToConfirm = '';

  constructor(
    private readonly notification: NotificationService,
    private readonly facturacionService: DocumentosService,
    private readonly router: Router,
  ) {}

  public readonly saveDataFactura = signal(false);

  saveDatos(buttonType: string) {
    // Validación común para verificar si el código '00' está presente
    const selectedPaymentMethod = this.selectedPaymentMethod();
    const isCreditoSelected = selectedPaymentMethod?.some((method) => method.metodoPago?.code === '00');

    // Validación para 'Credito'
    if (buttonType === 'Credito' && !isCreditoSelected) {
      this.notification.push({
        message: 'Por favor, seleccione el método de pago "Crédito" para continuar.',
        type: 'error',
      });
      return; // Detener la ejecución si no hay un método de pago con código '00'
    }

    // Validación para 'Factura' cuando el pago es 'Credito'
    if (buttonType === 'Factura' && isCreditoSelected) {
      this.notification.push({
        message:
          'No puedes emitir una factura cuando se ha seleccionado "Crédito". Selecciona otro método de pago para continuar con la factura.',
        type: 'error',
      });
      return; // Detener la ejecución si el pago seleccionado es 'Credito'
    }

    // Continuar con las demás validaciones
    const infoCustomer = this.infoCustomer();

    // Verificar si se ha seleccionado un establecimiento
    if (!this.selectedEstabliecimient()) {
      this.notification.push({
        message: 'Por favor, seleccione un establecimiento',
        type: 'error',
      });
      return;
    }

    // Verificar si se ha ingresado un código de punto
    if (!this.pointCode()) {
      this.notification.push({
        message: 'Por favor, ingrese un código de punto',
        type: 'error',
      });
      return;
    }

    // Verificar si la información del cliente está completa
    if (!infoCustomer) {
      this.notification.push({
        message: 'Por favor, seleccione un cliente',
        type: 'error',
      });
      return;
    }

    if (this.products()?.length === 0) {
      this.notification.push({
        message: 'No hay productos disponibles para registrar la venta',
        type: 'error',
      });
      return;
    }

    // Verificar si se ha seleccionado un método de pago
    if (!selectedPaymentMethod || selectedPaymentMethod.length === 0) {
      this.notification.push({
        message: 'Por favor, seleccione un método de pago',
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

    // Si todas las validaciones son correctas, guardar los datos de la factura
    switch (buttonType) {
      case 'Credito':
        this.actionToConfirm = 'Credito';
        this.modalMessage =
          '¿Estás seguro de que quieres registrar el crédito? Al confirmar, se procederá con el registro del crédito y la actualización de los detalles relacionados en el sistema.';
        break;
      case 'Guardar':
        this.actionToConfirm = 'Guardar';
        this.modalMessage =
          '¿Estás seguro de que quieres guardar la factura? Esta acción también la convertirá en una proforma.';
        break;
      case 'Factura':
        this.actionToConfirm = 'Factura';
        this.modalMessage =
          '¿Estás seguro de que quieres enviar la factura al SRI para su autorización? Esta acción enviará los datos al sistema del SRI para su validación y procesamiento.';
        break;
    }

    // Abre el modal
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
      paysForms: selectedPaymentMethod?.map((p) => ({
        code: p.metodoPago.code,
        description: p.metodoPago.description,
        total: p.valor,
        timeUnit: p.tiempo,
        plazo: p.plazo,
      })),

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
      observation: this.observation(),
    };
    return dataFacturacion;
  }
  /**
   * Guarda la factura en el servidor como proforma o como factura según sea
   * especificado.
   * @param type Tipo de documento a guardar. Puede ser 'proforma' o 'factura'.
   */
  saveDocument() {
    const dataFacturacion = this.infoDataFactura();
    console.log(dataFacturacion);
    let serviceCall;
    switch (this.actionToConfirm) {
      case 'Guardar':
        serviceCall = this.facturacionService.generateProforma(dataFacturacion);
        break;
      case 'Factura':
        serviceCall = this.facturacionService.generateInvoice(dataFacturacion);
        break;
      case 'Credito':
        serviceCall = this.facturacionService.generateCredito(dataFacturacion);
        break;
      // case 'guardar':
      //   serviceCall = this.facturacionService.updateProforma(dataFacturacion, this.infoProforma().invoiceIde);
      //   break;
      // case 'updateEnviar':
      //   serviceCall = this.facturacionService.updateProformaSend(dataFacturacion, this.infoProforma().invoiceIde);
      //   break;
      default:
        console.error(`Tipo de documento no soportado: ${this.actionToConfirm}`);
        return;
    }

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => serviceCall),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((response) => {
        if (response.status === 'OK') {
          this.saveDataFactura.set(false);
          this.selectedEstabliecimient.set('');
          this.selectedPaymentMethod.set([]);
          this.detailProducts.set([]);
          this.products.set([]);
          this.infoCustomer.set(null);
          this.infoProforma.set(null);
          this.notification.push({
            message: `El documento ha sido generado correctamente`,
            type: 'success',
          });

          // if (this.actionToConfirm === 'guardar') {
          //   this.router.navigate(['/sistema_contable_empresa/emision_empresas']);
          // }
          // if (this.actionToConfirm === 'factura') {
          //   this.router.navigate(['/sistema_contable_empresa/emision_empresas']);
          // }
        }
      });
  }
}
