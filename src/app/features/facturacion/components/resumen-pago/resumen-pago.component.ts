import { CurrencyPipe, JsonPipe, KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { AccountingControlSystemService } from '@/utils/services';
import { GeneriResp } from '../../../../interfaces';
import { FormsModule } from '@angular/forms';
import { CreateFacturacionService } from '../../create-facturacion.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-resumen-pago',
  imports: [KeyValuePipe, FormsModule, JsonPipe, CurrencyPipe],
  templateUrl: './resumen-pago.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumenPagoComponent {
  ivaPercentage = signal(12);
  products = signal<any[]>([]);


  constructor(
    private readonly controlService: AccountingControlSystemService,
    public readonly configFactu: CreateFacturacionService,
  ) {
    this.getPayForms();
    this.getImpuestoIVA();

    toObservable(this.listProduct)
      .pipe(takeUntilDestroyed())
      .subscribe((updatedProducts) => {
        console.log('data recibe', updatedProducts);


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
                const baseImponible = basesImponiblesIva.find(
                  (bi: any) => bi.codeTarifaIva === iva.key
                );
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

      });
  }

  public readonly listProduct = computed(() => this.configFactu.products());
  public readonly paymentMethods = signal<GeneriResp<any[]> | null>(null);

  public valuesCalculates = signal<any[] | null>([]);

  selectedPaymentMethod = signal<string>('');

  public readonly listIva = signal<GeneriResp<any[]> | null>(null);

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
        console.log(response);
        this.listIva.set(response);
        this.createDetailsPay();
      }
    });
  }


  createDetailsPay() {

    const tarifaIva: any = [];
    this.listIva()?.data.forEach((tipoIva) => {
      tarifaIva.push({
        key: tipoIva.codeTariff,
        label: tipoIva.description,
        value: 0,
      });
    });

    this.valuesCalculates()?.push({ key: 'tarifaIva', values: tarifaIva });
    this.valuesCalculates()?.push({ key: 'IVA', values: 0, label: 'IVA' });
    this.valuesCalculates()?.push({ key: 'ICE', values: 0, label: 'ICE' });
    this.valuesCalculates()?.push({ key: 'SUBTOTAL', values: 0, label: 'SUBTOTAL' });
    this.valuesCalculates()?.push({ key: 'PROPINA', values: 0 , label: 'PROPINA'});
    this.valuesCalculates()?.push({ key: 'TOTAL', values: 0,  label: 'TOTAL' });
  }
}
