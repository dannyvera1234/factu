import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ModalComponent, ViewerDocumentComponent } from '@/components';
import { CurrencyPipe, NgClass, NgOptimizedImage, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CustomDatePipe } from '@/pipes';
import { of, mergeMap, finalize } from 'rxjs';
import { GeneriResp } from '@/interfaces';
import { DocumentosService } from '@/services/service-empresas';
import { ConfigFacturacionService, NotificationService } from '@/utils/services';
import { DeleteFacturaComponent } from './components';
import { Modulos } from '@/utils/permissions';

@Component({
  selector: 'app-documents',
  imports: [
    NgClass,
    FormsModule,
    TableModule,
    ButtonModule,
    FormsModule,
    CurrencyPipe,
    CustomDatePipe,
    SlicePipe,
    ModalComponent,
    DeleteFacturaComponent,
    ViewerDocumentComponent,
    NgOptimizedImage,
  ],
  templateUrl: './documents.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsComponent {
  public readonly listInvoices = signal<GeneriResp<any> | null>(null);
  public readonly historial = signal<GeneriResp<any> | null>(null);
  public readonly currentDocumentUrl = signal<string | null>(null);
  public readonly ideDeleteFactura = signal<number | null>(null);
  public readonly filterInvoices = signal<any | null>(null);
  public readonly open = signal<'nombre' | null>(null);
  public readonly numElementsByPage = signal<number>(0);
  public readonly loadingHstorial = signal(false);
  public readonly isModalOpen = signal(false);
  public readonly loading = signal(false);
  private size = Modulos.PAGE_SIZE;
  public searchQuery = '';
  private page = 0;

  constructor(
    private readonly docService: DocumentosService,
    public readonly config: ConfigFacturacionService,
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

  eliminarFactura(ide: number): void {
    const currentInvoices = this.listInvoices();
    if (!currentInvoices?.data?.listData) return;
    const newInvoices = {
      ...currentInvoices,
      data: {
        ...currentInvoices.data,
        listData: currentInvoices!.data!.listData!.filter((invoice: any) => invoice.ide != ide),
      },
    };

    this.listInvoices.set(newInvoices);
  }

  openDocument(item: any) {
    this.currentDocumentUrl.set(item);
    this.isModalOpen.set(true);
  }

  closeDocument() {
    this.isModalOpen.set(false);
    this.currentDocumentUrl.set(null);
  }

  historiaInvoice(id: number) {
    of(this.loadingHstorial.set(true))
      .pipe(
        mergeMap(() => this.docService.histories(id)),
        finalize(() => this.loadingHstorial.set(false)),
      )
      .subscribe((res) => {
        if (res.status === 'OK') {
          this.historial.set(res);
        }
      });
  }

  getListInvoices(): void {
    const filter = {
      page: this.page,
      size: this.size,
      search: this.searchQuery,
    };
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.docService.listInvoices(filter)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((res) => {
        if (res.status === 'OK') {
          console.log(res);
          this.listInvoices.set(res);
          this.filterInvoices.set(res.data.page);
          this.numElementsByPage.set(res.data.page.numElementsByPage);
        }
      });
  }

  onPageChange(newPage: any): void {
    this.page = newPage.first / newPage.rows;
    this.size = newPage.rows;
    this.getListInvoices();
  }

  reeviarEmail(id: number) {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.docService.sendNotification(id)),
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

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.notification.push({
        message: 'Se copió la clave de acceso.',
        type: 'success',
      });
    });
  }
}
