import { ChangeDetectionStrategy, Component, computed, EventEmitter, Output, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { GeneriResp } from '@/interfaces';
import { FacturacionService } from '@/services';
import { CreateFacturacionService } from '../../../../create-facturacion.service';
import { CurrencyPipe, NgClass } from '@angular/common';
import { TextInitialsPipe } from '@/pipes';

@Component({
  selector: 'app-list-product',
  imports: [NgClass, CurrencyPipe, TextInitialsPipe],
  templateUrl: './list-product.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListProductComponent {
  public readonly persoRolIdEmisor = computed(() => this.configFactu.setEmisor());

  public readonly listProducts = signal<GeneriResp<any[]> | null>(null);

  @Output() public readonly addProducto = new EventEmitter<any | null>();

  constructor(
    private readonly configFactu: CreateFacturacionService,
    private readonly facturacionService: FacturacionService,
  ) {
    toObservable(this.persoRolIdEmisor)
      .pipe()
      .subscribe((emisor) => {
        if (emisor !== null) {
          this.facturacionService.getListaProductos(emisor).subscribe((resp) => {
            if (resp.status === 'OK') {
              console.log(resp);
              this.listProducts.set(resp);
            }
          });
        }
      });
  }

  addProduct(product: any) {
    this.addProducto.emit(product);
  }
}
