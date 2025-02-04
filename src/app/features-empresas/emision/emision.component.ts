import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FacturaComponent } from './components';
import { DocumentosService } from '../../services/service-empresas';
import { GeneriResp } from '@/interfaces';
import { Subject, takeUntil } from 'rxjs';

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

  private readonly destroy$ = new Subject<void>();

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

  /**
   * Verifica si el parámetro 'ideEncrypted' existe en la ruta y, en caso de que exista, llama al
   * método 'editProforma' para obtener la información de la proforma correspondiente.
   *
   * @description
   * Este método se llama cuando se inicializa el componente.
   * Revisa si el parámetro 'ideEncrypted' existe en la ruta y, si es así, llama al método
   * 'editProforma' para obtener la información de la proforma correspondiente.
   * Si el parámetro no existe, establece el valor de 'infoEditProforma' en null.
   */
  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const ideEncrypted = params.get('ideEncrypted');

      if (ideEncrypted) {
        this.docService.editProforma(ideEncrypted).subscribe((response) => {
          if (response.status === 'OK') {
            this.infoEditProforma.set(response);
          }
        });
      } else {
        this.infoEditProforma.set(null);
      }
    });
  }


  /**
   * Valida la información necesaria para la emisión de facturas.
   *
   * Llama al método 'validateInformation' del servicio 'DocumentosService' para obtener
   * la información necesaria para la emisión de facturas. Si la respuesta es exitosa,
   * establece el valor de 'validateInfo' con la respuesta.
   */
  validateInformation(): void {
    this.docService.validateInformation().subscribe((response) => {
      if (response.status === 'OK') {
        this.validateInfo.set(response);
      }
    });
  }
}
