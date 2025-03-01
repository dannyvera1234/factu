import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ModalComponent } from '@/components';
import { of, mergeMap, finalize } from 'rxjs';
import { ListClientes, GeneriResp } from '@/interfaces';
import { ProveedorService } from '../../services/service-empresas';
import { FormatIdPipe, TextInitialsPipe } from '@/pipes';
import {  NgOptimizedImage } from '@angular/common';
import {  AgregarProveedorComponent } from './components';
import { Modulos } from '../../utils/permissions';
import { PaginationComponent } from '../../components/pagination';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-proveedores',
  imports: [
    ModalComponent,
    TextInitialsPipe,
    FormatIdPipe,
    NgOptimizedImage,
    PaginationComponent,
    AgregarProveedorComponent,
    RouterLink

  ],
  templateUrl: './proveedores.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProveedoresComponent {
  public readonly loading = signal(false);

  public readonly updateClient = signal<ListClientes | null>(null);

  public readonly idePersona = signal<number>(0);

  public readonly listProveedor = signal<GeneriResp<any> | null>(null);

  public readonly viewingIdeCustomer = signal<number | null>(null);

  public readonly infoXML = signal<any | null>(null);

  constructor(private readonly proveedorService: ProveedorService) {
    this.getListProveedor(0);
  }

  getListProveedor(page: number): void {

    const filter ={
      page: page,
      size: Modulos.PAGE_SIZE,
      apply: true,
      search: '',
    }

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.proveedorService.listaProveedor(filter)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          console.log(resp);
          this.listProveedor.set(resp);
        }
      });
  }

  onPageChange(newPage: number): void {
    const pagination = this.listProveedor()?.data?.page;

    if (pagination) {
      pagination.currentPage = newPage;

      // Lógica adicional para manejar hasNext y hasPrevious
      pagination.hasNext = newPage < pagination.totalPages;
      pagination.hasPrevious = newPage > 1;

      this.getListProveedor(newPage);
      // Aquí puedes realizar acciones adicionales, como cargar datos desde un servidor
    }
  }

  cargar(evet: any) {
    this.infoXML.set(null);
  }

  cargarArchivo(data: any) {
    if (data) {
      this.infoXML.set(data);
    }
  }

  // deleteCliente(ideCustomer: number) {
  //   const currentCliente = this.listProveedor();

  //   if (currentCliente) {
  //     const updatedCliente = {
  //       ...currentCliente,
  //       data: currentCliente.data.filter((cliente) => cliente.ideCustomer !== ideCustomer),
  //     };

  //     this.listProveedor.set(updatedCliente);
  //   }
  // }
}
