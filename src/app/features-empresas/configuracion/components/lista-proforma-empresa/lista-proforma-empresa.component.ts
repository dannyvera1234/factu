import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';
import { GeneriResp } from '@/interfaces';
import { ConfigFacturacionService, NotificationService } from '@/utils/services';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '@/components';
import {
  FacturarProformasComponent,
  FiltersProformaComponent,
  TablaProcesoComponent,
  TablaRegistradaComponent,
} from './components';

@Component({
  selector: 'app-lista-proforma-empresa',
  imports: [
    FormsModule,
    ModalComponent,
    FiltersProformaComponent,
    FacturarProformasComponent,
    TablaProcesoComponent,
    TablaRegistradaComponent,
  ],
  templateUrl: './lista-proforma-empresa.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaProformaEmpresaComponent {
  public readonly showTableProforma = signal('');

  searchQuery: string = '';

  @ViewChild('facturarProforma') facturarProformaModal: any;

  public readonly ideProforma = signal<number[] | null>(null);

  public readonly ideEnviadoProceso = signal<number | null>(null);

  constructor(
    public readonly config: ConfigFacturacionService,
    private readonly notification: NotificationService,
  ) {}

  onSearchChange(): void {
    // const query = this.searchQuery.trim().toLowerCase();
    // if (this.listProformas() && query) {
    //   // Verifica que 'listData' sea un array y tenga elementos
    //   const listData = this.listProformas()!.data.listData;
    //   // Filtra las proformas según el texto ingresado, por cada letra
    //   const filteredProformas = listData.filter((invoice: any) => {
    //     const socialReasonMatch = invoice.socialReasonCustomer
    //       ? invoice.socialReasonCustomer.toLowerCase().includes(query)
    //       : false;
    //     const identificationMatch = invoice.identificationCustomer
    //       ? invoice.identificationCustomer.toString().includes(query)
    //       : false;
    //     return socialReasonMatch || identificationMatch;
    //   });
    //   // Actualiza el estado con las proformas filtradas
    //   this.listProformas.set({
    //     ...this.listProformas()!,
    //     data: {
    //       ...this.listProformas()!.data,
    //       listData: filteredProformas,
    //     },
    //   });
    // } else {
    //   // Si el campo de búsqueda está vacío, mostramos todas las proformas
    //   //  this.getListInvoices(0);
    // }
  }

  convertirProformas() {
    // Verifica si hay IDs seleccionados en `ideProforma`
    if (this.ideProforma()?.length) {
      console.log(this.ideProforma());
      this.facturarProformaModal.open();
    } else {
      this.notification.push({
        message: 'Seleccione al menos una proforma para facturar.',
        type: 'error',
      });
    }
  }



  ideProformas(ids: number[]) {
    // Guarda los IDs seleccionados, o establece null si no hay ninguno
    this.ideProforma.set(ids.length ? ids : null);
  }

  buscarTablaProforma(info: string) {
    if (info !== '') {
      this.showTableProforma.set(info);
    }
  }
}
