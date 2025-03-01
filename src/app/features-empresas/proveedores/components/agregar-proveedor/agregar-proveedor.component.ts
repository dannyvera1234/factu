import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalComponent } from '../../../../components';
import { NgOptimizedImage } from '@angular/common';
import { RegistroProveedorComponent } from '../registro-proveedor';
import { RegistroContadoresComponent } from "../../../../web/registro-contadores/registro-contadores.component";

@Component({
  selector: 'app-agregar-proveedor',
  imports: [ModalComponent, NgOptimizedImage, RegistroProveedorComponent, RegistroContadoresComponent],
  templateUrl: './agregar-proveedor.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgregarProveedorComponent {
  @Output() public readonly agregarXML = new EventEmitter<any | null>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute, // Inyecta ActivatedRoute
  ) {}

  navigateToDetailsXml(): void {
    this.router.navigate(['importar-xml'], { relativeTo: this.activatedRoute });
  }
}
