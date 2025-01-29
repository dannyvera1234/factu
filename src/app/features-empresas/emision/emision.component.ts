import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
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
export class EmisionComponent implements OnInit {
  public readonly selectedTab = signal<'inventario' | 'doc' | 'clientes' | 'facturacion'>('facturacion');

  public readonly loading = signal(false);

  public readonly dataProforma = signal<GeneriResp<any> | null>(null);

  public changeTab(tab: 'inventario' | 'doc' | 'clientes' | 'facturacion'): void {
    this.selectedTab.set(tab);
  }

  public readonly validateInfo = signal<GeneriResp<any> | null>(null);

  constructor(
    private readonly docService: DocumentosService,
    private route: ActivatedRoute,
  ) {
    this.validateInformation();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id > 0) {
        console.log('ID recibido:', id);
      }
    });
  }

  validateInformation() {
    this.docService.validateInformation().subscribe((response) => {
      if (response.status === 'OK') {
        this.validateInfo.set(response);
      }
    });
  }
}
