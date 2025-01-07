import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { finalize, mergeMap, of } from 'rxjs';
import { CountersService } from '../../services/counters.service';
import { ByApplicationCounter, GeneriResp } from '@/interfaces';
import { CustomDatePipe, FormatIdPipe, FormatPhonePipe, TextInitialsPipe } from '@/pipes';
import { ConfigFacturacionService } from '@/utils/services';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { ModalComponent } from '@/components';
import {
  CreateEstablecimientoComponent,
  CreateFileComponent,
  DeleteEstablecimientoComponent,
  DeleteFileComponent,
  DeleteLogoComponent,
  DocAutorizadosComponent,
  InfoCardComponent,
  ListClienteComponent,
  ListInventarioComponent,
  SequentialComponent,
  UpdateEstablecimientoComponent,
  UpdateInfoPersonaComponent,
  UpdateInfoTributarioComponent,
  UpdateLogoComponent,
} from './components';

@Component({
  selector: 'app-details-counter-application',
  imports: [
    TextInitialsPipe,
    CustomDatePipe,
    NgClass,
    ModalComponent,
    UpdateInfoPersonaComponent,
    NgOptimizedImage,
    UpdateInfoTributarioComponent,
    CreateEstablecimientoComponent,
    ListInventarioComponent,
    DocAutorizadosComponent,
    InfoCardComponent,
    ListClienteComponent,
    DeleteFileComponent,
    CreateFileComponent,
    UpdateEstablecimientoComponent,
    DeleteEstablecimientoComponent,
    FormatPhonePipe,
    FormatIdPipe,
    UpdateLogoComponent,
    DeleteLogoComponent,
    SequentialComponent,
  ],
  templateUrl: './details-counter-application.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsCounterApplicationComponent {
  @Input() set idePersonaRolEncrypted(value: string) {
    this.getByIdePersona(value);
  }

  public readonly uploadingDoc = signal(false);

  public readonly selectedTab = signal<'inventario' | 'doc' | 'clientes' | 'balance'>('clientes');

  public readonly loading = signal(false);

  public readonly viewingInfo = signal<ByApplicationCounter | null>(null);

  public readonly viewingFile = signal<number | null>(null);

  public readonly viewingIdeSubsidiary = signal<number | null>(null);

  public readonly viewingPersona = signal<number | null>(null);

  public readonly viewingEstablecimiento = signal<any | null>(null);

  public readonly counterByPersona = signal<GeneriResp<ByApplicationCounter> | null>(null);

  constructor(
    private readonly counterService: CountersService,
    public readonly config: ConfigFacturacionService,
  ) {}

  public changeTab(tab: 'inventario' | 'doc' | 'clientes' | 'balance'): void {
    this.selectedTab.set(tab);
  }

  deleteFile(id: number) {
    const currentPersona = this.counterByPersona();

    if (currentPersona) {
      const updatedPersona = {
        ...currentPersona,
        data: {
          ...currentPersona.data,
          certificates: currentPersona.data.certificates.filter((item) => item.ide !== id),
        },
      };

      this.counterByPersona.set(updatedPersona);
    }
  }

  updateEstable(infoEstablecimiento: any) {
    const currentPersona = this.counterByPersona();

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

      this.counterByPersona.set(updatedPersona);
    }
  }

  deleteEstable(id: number) {
    const currentPersona = this.counterByPersona();

    if (currentPersona) {
      const updatedPersona = {
        ...currentPersona,
        data: {
          ...currentPersona.data,
          subsidiaries: currentPersona.data.subsidiaries.filter((item) => item.ideSubsidiary !== id),
        },
      };

      this.counterByPersona.set(updatedPersona);
    }
  }

  createEstable(infoEstablecimiento: any) {
    const currentPersona = this.counterByPersona();

    if (currentPersona) {
      const updatedPersona = {
        ...currentPersona,
        data: {
          ...currentPersona.data,
          subsidiaries: [...currentPersona.data.subsidiaries, infoEstablecimiento],
        },
      };

      this.counterByPersona.set(updatedPersona);
    }
  }

  createFile(file: any) {
    const currentPersona = this.counterByPersona();

    if (currentPersona) {
      const updatedPersona = {
        ...currentPersona,
        data: {
          ...currentPersona.data,
          certificates: [...currentPersona.data.certificates, file],
        },
      };

      this.counterByPersona.set(updatedPersona);
    }
  }

  updatePersona(infoPersona: Partial<any>) {
    const currentPersona = this.counterByPersona();

    if (currentPersona) {
      const updatedPersona = {
        ...currentPersona,
        data: {
          ...currentPersona.data,
          ...infoPersona,
        },
      };

      this.counterByPersona.set(updatedPersona);
    }
  }

  updateTributaria(infoTributaria: Partial<any>) {
    const currentPersona = this.counterByPersona();

    if (currentPersona) {
      const updatedPersona = {
        ...currentPersona,
        data: {
          ...currentPersona.data,
          ...infoTributaria,
        },
      };

      this.counterByPersona.set(updatedPersona);
    }
  }

  getByIdePersona(idePersonaRol: string) {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.counterService.getCounterByEmisor(idePersonaRol)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.counterByPersona.set(resp);
        }
      });
  }

  updateLogo(file: any) {
    const currentPersona = this.counterByPersona();

    if (currentPersona) {
      const updatedPersona = {
        ...currentPersona,
        data: {
          ...currentPersona.data,
          photo: file.data,
        },
      };

      this.counterByPersona.set(updatedPersona);
    }
  }

  deleteLog(photo: any) {
    const currentPersona = this.counterByPersona();

    if (currentPersona) {
      const updatedPersona = {
        ...currentPersona,
        data: {
          ...currentPersona.data,
          photo: photo,
        },
      };

      this.counterByPersona.set(updatedPersona);
    }
  }
}
