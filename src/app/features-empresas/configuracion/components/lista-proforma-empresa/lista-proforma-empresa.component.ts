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

  onSearchClick(): void {
    // Si el término de búsqueda está vacío, puedes manejarlo de alguna manera, como mostrar un mensaje de error.
    // if (this.searchQuery.trim()) {
    //   this.getListInvoices(0, this.searchQuery); // Realiza la búsqueda desde la primera página
    // } else {
    //   this.getListInvoices();
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
