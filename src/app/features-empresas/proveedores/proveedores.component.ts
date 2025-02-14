import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ModalComponent } from '@/components';
import { of, mergeMap, finalize } from 'rxjs';
import { ListClientes, GeneriResp } from '@/interfaces';
import { ProveedorService } from '../../services/service-empresas';
import { FormatIdPipe, FormatPhonePipe, TextInitialsPipe } from '@/pipes';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { AggXmlComponent, DetailsXmlComponent } from './components';

@Component({
  selector: 'app-proveedores',
  imports: [ModalComponent, TextInitialsPipe, FormatIdPipe, FormatPhonePipe, NgOptimizedImage, AggXmlComponent, DetailsXmlComponent],
  templateUrl: './proveedores.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProveedoresComponent {
 public readonly loading = signal(false);

  public readonly updateClient = signal<ListClientes | null>(null);

  public readonly idePersona = signal<number>(0);

  public readonly listProveedor = signal<GeneriResp<ListClientes[]> | null>(null);

  public readonly viewingIdeCustomer = signal<number | null>(null);

  public readonly infoXML = signal<any | null>(null);

  constructor(private readonly proveedorService: ProveedorService) {
    this.getListProveedor();
  }

  getListProveedor() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.proveedorService.listoProveedor()),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.listProveedor.set(resp);
        }
      });
  }

  cargar(evet: any) {
    this.infoXML.set(null);
  }


  cargarArchivo(data: any){
    if(data){
      this.infoXML.set(data);
    }
  }


  deleteCliente(ideCustomer: number) {
    const currentCliente = this.listProveedor();

    if (currentCliente) {
      const updatedCliente = {
        ...currentCliente,
        data: currentCliente.data.filter((cliente) => cliente.ideCustomer !== ideCustomer),
      };

      this.listProveedor.set(updatedCliente);
    }
  }


}
