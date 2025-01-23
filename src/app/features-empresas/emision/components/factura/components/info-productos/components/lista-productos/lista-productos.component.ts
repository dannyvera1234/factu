import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GeneriResp } from '@/interfaces';
import { NgClass, CurrencyPipe } from '@angular/common';
import { TextInitialsPipe } from '@/pipes';
import { DocumentosService } from '@/services/service-empresas';
import { CreateFacturaEmpresaService } from '../../../../create-factura-empresa.service';
import { NotificationService } from '@/utils/services';

@Component({
  selector: 'app-lista-productos',
  imports: [NgClass, CurrencyPipe, TextInitialsPipe],
  templateUrl: './lista-productos.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaProductosComponent {
  public readonly listProducts = signal<GeneriResp<any[]> | null>(null);

  @Output() public readonly addProducto = new EventEmitter<any | null>();

  public readonly persoRolIdEmisor = computed(() => this.configFactu.setEmisor());

  constructor(
    private readonly configFactu: CreateFacturaEmpresaService,
    private readonly facturacionService: DocumentosService,
    private readonly notification: NotificationService,
  ) {
    toObservable(this.persoRolIdEmisor)
      .pipe(takeUntilDestroyed())
      .subscribe((emisor) => {
        if (emisor !== null) {
          this.facturacionService.listProduct(emisor).subscribe((resp) => {
            if (resp.status === 'OK') {
              this.listProducts.set(resp);
            }
          });
        }
      });
  }

  addProduct(product: any) {
    if (product !== null) {
      this.addProducto.emit(product);
      this.notification.push({
        message: 'Productos cargados correctamente',
        type: 'success',
      });
    }
  }
}
