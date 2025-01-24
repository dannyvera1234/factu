import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { GeneriResp } from '@/interfaces';
import { NgClass, CurrencyPipe } from '@angular/common';
import { TextInitialsPipe } from '@/pipes';
import { DocumentosService } from '@/services/service-empresas';
import { NotificationService } from '@/utils/services';

@Component({
  selector: 'app-lista-productos',
  imports: [NgClass, CurrencyPipe, TextInitialsPipe],
  templateUrl: './lista-productos.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaProductosComponent {
  @Input({ required: true }) set setPersonaRol(value: any) {
    if (value !== null) {
      this.listProductos(value);
    }
  }
  public readonly listProducts = signal<GeneriResp<any[]> | null>(null);

  @Output() public readonly addProducto = new EventEmitter<any | null>();

  constructor(
    private readonly facturacionService: DocumentosService,
    private readonly notification: NotificationService,
  ) {}

  listProductos(emisor: number) {
    this.facturacionService.listProduct(emisor).subscribe((resp) => {
      if (resp.status === 'OK') {
        this.listProducts.set(resp);
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
