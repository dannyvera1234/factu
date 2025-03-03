import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';
import { ConfigFacturacionService, NotificationService } from '../../utils/services';
import { ModalComponent, ViewerDocumentComponent } from '../../components';
import { DeleteProformaComponent, FacturarProformasComponent } from './components';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { of, mergeMap, finalize } from 'rxjs';
import { GeneriResp } from '../../interfaces';
import { DocumentosService } from '../../services/service-empresas';
import { CustomDatePipe } from '../../pipes';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Modulos } from '../../utils/permissions';
@Component({
  selector: 'app-proforma',
  imports: [
    ModalComponent,
    FacturarProformasComponent,
    FormsModule,
    TableModule,
    ButtonModule,
    FormsModule,
    CustomDatePipe,
    CurrencyPipe,
    DeleteProformaComponent,
    ViewerDocumentComponent,
    NgOptimizedImage
  ],
  templateUrl: './proforma.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProformaComponent {
  @ViewChild('facturarProforma') facturarProformaModal: any;
  public readonly listProformas = signal<GeneriResp<any> | null>(null);
  public readonly currentDocumentUrl = signal<string | null>(null);
  public readonly ideEnviadoProceso = signal<number | null>(null);
  public readonly ideDeleteProdorma = signal<number | null>(null);
  public readonly ideProforma = signal<number[] | null>(null);
  public readonly selectedRow = signal<number | null>(null);
  public readonly filterProforma = signal<any | null>(null);
  public readonly numElementsByPage = signal<number>(0);
  public readonly open = signal<'nombre' | null>(null);
  public readonly isModalOpen = signal(false);
  public readonly allSelected = signal(false);
  public readonly loading = signal(false);
  private size = Modulos.PAGE_SIZE;
  public searchQuery = '';
  private page = 0;


  constructor(
    public readonly config: ConfigFacturacionService,
    private readonly docService: DocumentosService,
    private readonly notification: NotificationService,
  ) {
    this.getListInvoices();
  }

  toggleFilter(filterName: 'nombre' | null) {
    if (this.open() === filterName) {
      this.open.set(null);
    } else {
      this.open.set(filterName);
    }
  }

  filter() {
    this.open.set(null);
    this.getListInvoices();
  }

  openDocument(item: any) {
    this.currentDocumentUrl.set(item);
    this.isModalOpen.set(true);
    this.selectedRow.set(null);
  }

  closeDocument() {
    this.isModalOpen.set(false);
    this.currentDocumentUrl.set(null);
  }

  selectAll(event: any) {
    const checked = event.target.checked;
    // Actualiza todos los elementos
    this.listProformas()!.data.listData.forEach((invoice: any) => {
      if (
        invoice.statusProcess !== 'EN PROCESO PROFORMA' &&
        (invoice.authorizationStatus !== 'NO AUTORIZADO' || invoice.receptionStatus === 'DEVUELTA')
      ) {
        invoice.selected = checked;
      }
    });
    this.updateSelectAll();
  }

  selectIndividual(invoice: any) {
    invoice.selected = !invoice.selected;

    // Verifica si todos están seleccionados para sincronizar el checkbox "Seleccionar todo"
    const allSelected = this.listProformas()!.data.listData.every((item: any) => {
      if (
        item.statusProcess !== 'EN PROCESO PROFORMA' &&
        (invoice.authorizationStatus !== 'NO AUTORIZADO' || invoice.receptionStatus === 'DEVUELTA')
      ) {
        item.selected;
      }
    });
    this.allSelected.set(allSelected);

    this.convertirProforma();
  }

  updateSelectAll() {
    const allSelectedValue = this.listProformas()!.data.listData.every((invoice: any) => invoice.selected);
    this.allSelected.set(allSelectedValue);

    // Actualiza la lista de proformas seleccionadas al seleccionar todos
    this.convertirProforma();
  }

  convertirProforma() {
    // Filtra las proformas seleccionadas
    const proformasSeleccionadas = this.listProformas()!.data.listData.filter((invoice: any) => invoice.selected);

    // Si hay cambios en la selección, emite la lista de IDs
    const ideList = proformasSeleccionadas.map((invoice: any) => invoice.ide);
    this.ideProforma.set(ideList);
  }

  convertirProformas() {
    if (this.ideProforma()?.length) {
      this.facturarProformaModal.open();
    } else {
      this.notification.push({
        message: 'Seleccione al menos una proforma para facturar.',
        type: 'error',
      });
    }
  }

  getListInvoices(): void {
    const filter = {
      page: this.page,
      size: this.size,
      search: this.searchQuery,
    };
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.docService.listProforma(filter)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((res) => {
        if (res.status === 'OK') {
          this.listProformas.set(res);
          this.numElementsByPage.set(res.data.page.numElementsByPage);
          this.filterProforma.set(res.data.page);
          this.allSelected.set(false);

          // Deselecciona todas las proformas
          this.listProformas()!.data.listData.forEach((invoice: any) => {
            invoice.selected = false;
          });
        }
      });
  }

  eliminarProforma(id: number) {
    if (id) {
      this.getListInvoices();
    }
  }

  onPageChange(newPage: any): void {
    this.page = newPage.first / newPage.rows;
    this.size = newPage.rows;
    this.getListInvoices();
  }

  reeviarEmail(id: number) {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.docService.sendNotificationProforma(id)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((res) => {
        if (res.status === 'OK') {
          this.notification.push({
            message: 'Correo enviado correctamente',
            type: 'success',
          });
        }
      });
  }
}
