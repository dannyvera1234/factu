import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FacturacionComponent } from '../facturacion';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-emision',
  imports: [FacturacionComponent, NgClass],
  templateUrl: './emision.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmisionComponent {
  public readonly selectedTab = signal<'inventario' | 'doc' | 'clientes' | 'facturacion'>('facturacion');

  public readonly loading = signal(false);

  public changeTab(tab: 'inventario' | 'doc' | 'clientes' | 'facturacion'): void {
    this.selectedTab.set(tab);
  }
}
