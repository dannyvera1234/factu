import { ChangeDetectionStrategy, Component, computed, Input, signal } from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GeneriResp } from '@/interfaces';
import { AccountingControlSystemService } from '@/utils/services';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateFacturaEmpresaService } from '../../create-factura-empresa.service';

@Component({
  selector: 'app-resumen-pago-enpresa',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './resumen-pago-enpresa.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumenPagoEnpresaComponent {
  @Input({ required: true }) valid!: boolean;

  @Input({ required: true })
  set editarResumenPago(event: any) {
    if (event) {
      this.procesoResumenPago(event);
      // if (!this.ejecutarFormPago()) {
      //   this.getPayForms().then(() => {
      //     this.procesarPayForms(event);
      //   });
      // } else {
      //   this.procesarPayForms(event);
      // }
    }
  }

  public readonly ejecutarFormPago = signal(false);

  public readonly listProduct = computed(() => this.configFactu.products());

  public readonly paymentMethods = signal<GeneriResp<any[]> | null>(null);

  public valuesCalculates = signal<any[] | null>([]);

  public readonly listIva = signal<GeneriResp<any[]> | null>(null);

  public readonly paymentMethodsOptions = computed(() =>
    (this.paymentMethods()?.data ?? []).map((method) => ({
      id: method.code,
      name: method.description,
    }))
  );




  constructor(
    private readonly controlService: AccountingControlSystemService,
    public readonly configFactu: CreateFacturaEmpresaService,
  ) {
    if (!this.ejecutarFormPago()) {
      this.getPayForms();
    }

    this.getImpuestoIVA();

    toObservable(this.listProduct)
      .pipe(takeUntilDestroyed())
      .subscribe((updatedProducts) => {
        const basesImponiblesIva: any = [];

        this.listIva()?.data.forEach((iva) => {
          const codeTarifaIva = iva.codeTariff;

          const productsFiltered = updatedProducts.filter((product) => {
            return product.tariffCodeIva === codeTarifaIva;
          });

          const subtotalBaseImponible = productsFiltered.reduce((acc, product) => {
            return acc + product.subTotal;
          }, 0);

          basesImponiblesIva.push({
            codeTarifaIva,
            subtotalBaseImponible,
          });
        });

        // Cálculo de IVA, ICE y otros valores
        let totalIVA = 0;
        let totalICE = 0;
        let subtotal = 0;
        let valorTotal = 0;

        updatedProducts.forEach((product) => {
          subtotal += product.subTotal || 0; // Acumulando subtotales
          totalIVA += product.valorIVA || 0; // Sumando valores de IVA
          valorTotal += product.valorTotal || 0; // Sumando totales

          // if (product.tariffCodeIce){
          // }
          totalICE += product.valorICE || 0; // Sumando valores de ICE
        });

        // Actualiza valuesCalculates con una nueva referencia
        const updatedValues = this.valuesCalculates()?.map((value) => {
          switch (value.key) {
            case 'tarifaIva':
              const updatedValues = value.values.map((iva: any) => {
                const baseImponible = basesImponiblesIva.find((bi: any) => bi.codeTarifaIva === iva.key);
                return {
                  ...iva,
                  value: baseImponible ? baseImponible.subtotalBaseImponible : 0,
                };
              });

              return {
                ...value,
                values: updatedValues,
              };
            case 'IVA':
              return { ...value, values: totalIVA };
            case 'ICE':
              return { ...value, values: totalICE };
            case 'SUBTOTAL':
              return { ...value, values: subtotal };
            case 'TOTAL':
              return { ...value, values: valorTotal };
            default:
              return value; // Mantener el resto sin cambios
          }
        });

        this.valuesCalculates.set(updatedValues || []);

        this.configFactu.infoVoucherReqDTO.set({
          inpuestoIva: this.valuesCalculates()?.filter((value) => value.key === 'tarifaIva')[0],
          totalSinImpuestos: subtotal,
          valorIva: totalIVA,
          valorIce: totalICE,
          importeTotal: valorTotal,
        });
      });
  }

  // private procesarPayForms(event: any) {
  //   event.paysForms.forEach((item: any) => {
  //     this.paymentMethods()?.data.forEach((method: any) => {
  //       if (method.code === item.code) {
  //         this.configFactu.selectedPaymentMethod.set(method);
  //       }
  //     });
  //   });
  // }

  public async procesoResumenPago(vouncher: any) {
    try {
      await this.getImpuestoIVA();
      const taxes = vouncher.infoVoucherReqDTO?.taxes;
      taxes.forEach((tax: any) => {
        this.valuesCalculates.update((state: any) => {
          const optionIvas = state.filter((item: any) => item.key === 'tarifaIva')[0].values;
          optionIvas.map((tipoIva: any) => {
            if (tipoIva.key === tax.tariffCode) {
              tipoIva.value = tax.imponibleBase;
            }
          });

          return state;
        });
      });

      this.valuesCalculates.update((state: any) => {
        const totalIva = state.filter((item: any) => item.key === 'IVA')[0];
        totalIva.values = vouncher.infoVoucherReqDTO.valorIva;
        const valorIce = state.filter((item: any) => item.key === 'ICE')[0];
        valorIce.values = vouncher.infoVoucherReqDTO.valorIce;
        const subTotal = state.filter((item: any) => item.key === 'SUBTOTAL')[0];
        subTotal.values = vouncher.infoVoucherReqDTO.totalSinImpuestos;
        const propina = state.filter((item: any) => item.key === 'PROPINA')[0];
        propina.values = vouncher.infoVoucherReqDTO.propina;
        const total = state.filter((item: any) => item.key === 'TOTAL')[0];
        total.values = vouncher.infoVoucherReqDTO.importeTotal;

        this.configFactu.infoVoucherReqDTO.set({
          inpuestoIva: this.valuesCalculates()?.filter((value) => value.key === 'tarifaIva')[0],
          totalSinImpuestos: vouncher.infoVoucherReqDTO.totalSinImpuestos,
          valorIva: vouncher.infoVoucherReqDTO.valorIva,
          valorIce: vouncher.infoVoucherReqDTO.valorIce,
          importeTotal: vouncher.infoVoucherReqDTO.importeTotal,
          propina: vouncher.infoVoucherReqDTO.propina,
        });

        return state;
      });
    } catch (error) {}
  }
  private getPayForms(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.controlService.getTypesPayForm().subscribe({
        next: (response) => {
          if (response.status === 'OK') {
            this.paymentMethods.set(response);

            this.ejecutarFormPago.set(true);
            resolve(); // Resolución exitosa
          } else {
            reject('Respuesta no válida');
          }
        },
        error: (err) => {
          reject(`Error en la solicitud: ${err.message}`);
        },
      });
    });
  }

  getImpuestoIVA(): Promise<void> {
    const IVA = 'IVA';
    return new Promise((resolve, reject) => {
      this.controlService.impuestoIVA(IVA).subscribe({
        next: (response) => {
          if (response.status === 'OK') {
            this.listIva.set(response);
            this.createDetailsPay();
            resolve(); // Resuelve la promesa exitosamente
          } else {
            reject('Error: Respuesta no OK.');
          }
        },
        error: (err) => reject(err), // Rechaza la promesa si hay un error
      });
    });
  }

  createDetailsPay() {
    const tarifaIva =
      this.listIva()?.data.map((tipoIva) => ({
        key: tipoIva.codeTariff,
        label: tipoIva.description,
        value: 0, // Inicializa con 0
        tariffValue: tipoIva.tariffIva,
      })) || [];

    const defaultValues = [
      { key: 'IVA', values: 0, label: 'IVA' },
      { key: 'ICE', values: 0, label: 'ICE' },
      { key: 'SUBTOTAL', values: 0, label: 'SubTotal' },
      { key: 'PROPINA', values: 0, label: 'Propina' },
      { key: 'TOTAL', values: 0, label: 'Total' },
    ];

    // Configura los valores iniciales
    this.valuesCalculates.set([{ key: 'tarifaIva', values: tarifaIva }, ...defaultValues]);
  }
}
