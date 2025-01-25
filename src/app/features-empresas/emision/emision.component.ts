import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FacturaComponent } from './components';
import { DocumentosService } from '../../services/service-empresas';
import { GeneriResp } from '../../interfaces';

@Component({
  selector: 'app-emision',
  imports: [NgClass, FacturaComponent, RouterLink],
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

  public readonly validateInfo = signal<GeneriResp<any> | null>(null);

  constructor(private readonly docService: DocumentosService) {
    this.validateInformation();
  }

  validateInformation() {
    this.docService.validateInformation().subscribe((response) => {
      if (response.status === 'OK') {
        this.validateInfo.set(response);
        console.log(response);
      }
    });
  }
}
