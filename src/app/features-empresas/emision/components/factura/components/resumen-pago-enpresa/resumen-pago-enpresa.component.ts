import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GeneriResp } from '../../../../../../interfaces';
import { AccountingControlSystemService } from '../../../../../../utils/services';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateFacturaEmpresaService } from '../../create-factura-empresa.service';

@Component({
  selector: 'app-resumen-pago-enpresa',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './resumen-pago-enpresa.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResumenPagoEnpresaComponent {
public readonly listProduct = computed(() => this.configFactu.products());

  public readonly paymentMethods = signal<GeneriResp<any[]> | null>(null);

  public valuesCalculates = signal<any[] | null>([]);

  public readonly listIva = signal<GeneriResp<any[]> | null>(null);

  constructor(
    private readonly controlService: AccountingControlSystemService,
    public readonly configFactu: CreateFacturaEmpresaService,
  ) {
    this.getPayForms();
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

  private getPayForms() {
    this.controlService.getTypesPayForm().subscribe((response) => {
      if (response.status === 'OK') {
        this.paymentMethods.set(response);
      }
    });
  }
  getImpuestoIVA(): void {
    const IVA = 'IVA';
    this.controlService.impuestoIVA(IVA).subscribe((response) => {
      if (response.status === 'OK') {
        this.listIva.set(response);
        this.createDetailsPay();
      }
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
