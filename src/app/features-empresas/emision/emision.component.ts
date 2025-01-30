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

  public readonly infoEditProforma = signal<GeneriResp<any> | null>(null);

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
      // Verificamos si 'ideEncrypted' existe en los parámetros de la URL
      const ideEncrypted = params.get('ideEncrypted');
      if (ideEncrypted) {
        // Si el parámetro 'ideEncrypted' está presente, realizamos la acción correspondiente
        this.docService.editProforma(ideEncrypted).subscribe((response) => {
          // Verificamos el estado de la respuesta antes de realizar cualquier acción
          if (response.status === 'OK') {
            console.log('Información de la proforma obtenida:', response);
              this.infoEditProforma.set(response); // Establece la información de la proforma para su edición
          } else {
            console.error('Error al obtener la información de la proforma.');
          }
        });
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
