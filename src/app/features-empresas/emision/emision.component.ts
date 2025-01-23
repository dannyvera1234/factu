import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FacturaComponent } from './components';


@Component({
  selector: 'app-emision',
  imports: [NgClass, FacturaComponent],
  templateUrl: './emision.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmisionComponent {

public readonly selectedTab = signal<'inventario' | 'doc' | 'clientes' | 'facturacion'>('facturacion');

  public readonly loading = signal(false);

  public changeTab(tab: 'inventario' | 'doc' | 'clientes' | 'facturacion'): void {
    this.selectedTab.set(tab);
  }

}
