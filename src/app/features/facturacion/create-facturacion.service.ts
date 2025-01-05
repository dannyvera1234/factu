import {  Injectable, signal } from '@angular/core';
import { DetailsProducto } from '../../interfaces';
import { NotificationService } from '../../utils/services';

@Injectable({
  providedIn: 'root',
})
export class CreateFacturacionService {
  public readonly setEmisor = signal<number | null>(null);

  public readonly idePersona = signal<number>(0);

  public readonly infoEmisor = signal<any | null>(null);

  public  pointCode = signal<string>('001');

  public readonly infoCustomer = signal<any | null>(null);

  public readonly products = signal<any[]>([]);

  public readonly selectedEstabliecimient = signal('');

  public readonly detailProducts = signal<DetailsProducto[] | null>([]);

  public readonly selectedPaymentMethod = signal<any | null>('');

  constructor(private readonly notification: NotificationService) {}

  submit() {
    const infoEmisor = this.infoEmisor();
    const infoCustomer = this.infoCustomer();
    const selectedPaymentMethod = this.selectedPaymentMethod();

    if (this.products()?.length === 0) {
      this.notification.push({
        message: 'No hay productos disponibles para registrar la venta',
        type: 'error',
      });
      return;
    }

    // Verifica si todos los campos están completos
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
    const emissionDate = new Date();
    const formattedDate = emissionDate.toISOString().split('T')[0]; // "2025-01-03"

    // Si todos los campos están completos, procedemos a enviar los datos
    const dataFacturacion = {
      infoEmisor: {
        identificationNumber: infoEmisor.identificationNumber,
        typeDocument: infoEmisor.typeDocument,
        socialReason: infoEmisor.socialReason,
        address: infoEmisor.address,
        email: infoEmisor.email,
        cellPhone: infoEmisor.cellPhone,
        personaRolIde: infoEmisor.personaRolIde,
      },
      infoCustomer: {
        identificationNumber: infoCustomer.identificationNumber,
        typeDocument: infoCustomer.typeDocument,
        socialReason: infoCustomer.socialReason,
        address: infoCustomer.address,
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
        valueIce: product.valorICE || null,
        subtotal: product.subTotal,
        total: product.valorTotal,
      })),
      paysForms: [
        {
          code: selectedPaymentMethod.code,
          description: selectedPaymentMethod.description,
          total: null,
          timeUnit: 'dias',
          plazo: '0',
        },
      ],
      infoVoucherReqDTO: {
        taxes: [
          {
            codeTaxType: '01',
            description: 'IVA',
            tariffCode: '2',
            tariffValue: 12,
            imponibleBase: 0,
          },
        ],
        totalSinImpuestos: 0,
        totalDescuento: 0,
        valorIva: 0,
        valorIce: 0,
        propina: 0,
        importeTotal: 0,
      },
      observation: '',
    };

    console.log(dataFacturacion);

    // Aquí puedes proceder a enviar los datos a un servidor o realizar alguna acción adicional.
  }
}
