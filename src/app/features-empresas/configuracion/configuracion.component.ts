import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ModalComponent } from '@/components';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { of, mergeMap, finalize } from 'rxjs';
import { ByApplicationCounter, GeneriResp } from '@/interfaces';
import { ConfigFacturacionService } from '@/utils/services';
import { CustomDatePipe, FormatIdPipe, FormatPhonePipe, TextInitialsPipe } from '@/pipes';
import { EmpresaService } from '@/services/service-empresas';
import {
  BalanceComponent,
  CreateEstablecimientoComponent,
  CreateFileComponent,
  DeleteEstablecimientoComponent,
  DeleteFileComponent,
  DeleteLogoComponent,
  InfoCardEmpresaComponent,
  ListaClientesEmpresaComponent,
  ListaDocEmpresaComponent,
  SequentialComponent,
  UpdateEmisorComponent,
  UpdateEmisorTributariaComponent,
  UpdateEstablecimientoComponent,
  UpdateLogoComponent,
} from './components';
import { ListaProductoEmpresaComponent } from './components/lista-producto-empresa';

@Component({
  selector: 'app-configuracion',
  imports: [
    ModalComponent,
    NgClass,
    FormatIdPipe,
    FormatPhonePipe,
    CustomDatePipe,
    TextInitialsPipe,
    NgOptimizedImage,
    UpdateEmisorComponent,
    UpdateEmisorTributariaComponent,
    CreateFileComponent,
    DeleteFileComponent,
    DeleteEstablecimientoComponent,
    CreateEstablecimientoComponent,
    UpdateEstablecimientoComponent,
    SequentialComponent,
    UpdateLogoComponent,
    DeleteLogoComponent,
    ListaClientesEmpresaComponent,
    ListaProductoEmpresaComponent,
    ListaDocEmpresaComponent,
    InfoCardEmpresaComponent,
    BalanceComponent,
  ],
  templateUrl: './configuracion.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguracionComponent {
  public readonly uploadingDoc = signal(false);

  public readonly selectedTab = signal<'inventario' | 'doc' | 'clientes' | 'balance' >('clientes');

  public readonly loading = signal(false);

  public readonly viewingEmisor = signal<ByApplicationCounter | null>(null);

  public readonly emisorInfo = signal<GeneriResp<ByApplicationCounter> | null>(null);

  public readonly viewingRuc = signal<any | null>(null);

  public readonly viewingIdeSubsidiary = signal<number | null>(null);

  public readonly viewingEstablecimiento = signal<any | null>(null);

  public readonly viewingFile = signal<number | null>(null);

  public readonly viewingInfo = signal<ByApplicationCounter | null>(null);

  constructor(
    private readonly emisorService: EmpresaService,
    public readonly config: ConfigFacturacionService,
  ) {
    this.retrieveEmisor();
  }

  public changeTab(tab: 'inventario' | 'doc' | 'clientes'  | 'balance'): void {
    this.selectedTab.set(tab);
  }

  retrieveEmisor() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.emisorService.retrieveEmisor()),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.emisorInfo.set(resp);
        }
      });
  }

  public updateEmisor(dataEmisor: any) {
    const currentEmisor = this.emisorInfo();

    if (currentEmisor) {
      const updatedPersona = {
        ...currentEmisor,
        data: {
          ...currentEmisor.data,
          ...dataEmisor,
        },
      };

      this.emisorInfo.set(updatedPersona);
    }
  }

  updateTributaria(infoTributaria: Partial<any>) {
    const currentPersona = this.emisorInfo();

    if (currentPersona) {
      const updatedPersona = {
        ...currentPersona,
        data: {
          ...currentPersona.data,
          ...infoTributaria,
        },
      };

      this.emisorInfo.set(updatedPersona);
    }
  }

  createFile(file: any) {
    const currentPersona = this.emisorInfo();

    if (currentPersona) {
      const updatedPersona = {
        ...currentPersona,
        data: {
          ...currentPersona.data,
          certificates: [...currentPersona.data.certificates, file],
        },
      };

      this.emisorInfo.set(updatedPersona);
    }
  }

  deleteFile(id: number) {
    const currentPersona = this.emisorInfo();

    if (currentPersona) {
      const updatedPersona = {
        ...currentPersona,
        data: {
          ...currentPersona.data,
          certificates: currentPersona.data.certificates.filter((item) => item.ide !== id),
        },
      };

      this.emisorInfo.set(updatedPersona);
    }
  }

  createEstable(infoEstablecimiento: any) {
    const currentPersona = this.emisorInfo();

    if (currentPersona) {
      const updatedPersona = {
        ...currentPersona,
        data: {
          ...currentPersona.data,
          subsidiaries: [...currentPersona.data.subsidiaries, infoEstablecimiento],
        },
      };

      this.emisorInfo.set(updatedPersona);
    }
  }

  deleteEstable(id: number) {
    const currentPersona = this.emisorInfo();

    if (currentPersona) {
      const updatedPersona = {
        ...currentPersona,
        data: {
          ...currentPersona.data,
          subsidiaries: currentPersona.data.subsidiaries.filter((item) => item.ideSubsidiary !== id),
        },
      };

      this.emisorInfo.set(updatedPersona);
    }
  }

  updateEstable(infoEstablecimiento: any) {
    const currentPersona = this.emisorInfo();

    if (currentPersona) {
      const updatedPersona = {
        ...currentPersona,
        data: {
          ...currentPersona.data,
          subsidiaries: currentPersona.data.subsidiaries.map((item) => {
            if (item.ideSubsidiary === infoEstablecimiento.ideSubsidiary) {
              return {
                ...item,
                ...infoEstablecimiento,
              };
            }

            return item;
          }),
        },
      };

      this.emisorInfo.set(updatedPersona);
    }
  }

  updateLogo(file: any) {
    const currentPersona = this.emisorInfo();

    if (currentPersona) {
      const updatedPersona = {
        ...currentPersona,
        data: {
          ...currentPersona.data,
          photo: file.data,
        },
      };

      this.emisorInfo.set(updatedPersona);
    }
  }

  deleteLog(photo: any) {
    const currentPersona = this.emisorInfo();

    if (currentPersona) {
      const updatedPersona = {
        ...currentPersona,
        data: {
          ...currentPersona.data,
          photo: photo.data,
        },
      };

      this.emisorInfo.set(updatedPersona);
    }
  }
}
