import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ModalComponent } from '@/components';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { of, mergeMap, finalize } from 'rxjs';
import { ByApplicationCounter, GeneriResp } from '@/interfaces';
import { ConfigFacturacionService } from '@/utils/services';
import { CustomDatePipe, FormatIdPipe, FormatPhonePipe, TextInitialsPipe } from '@/pipes';
import { EmpresaService } from '@/services/service-empresas';
import {
  CreateFileComponent,
  DeleteFileComponent,
  DeleteLogoComponent,
  InfoCardEmpresaComponent,
  SequentialComponent,
  UpdateEmisorComponent,
  UpdateEmisorTributariaComponent,
  UpdateLogoComponent,
} from './components';
import { ButtonModule } from 'primeng/button';

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
    SequentialComponent,
    UpdateLogoComponent,
    DeleteLogoComponent,
    InfoCardEmpresaComponent,
    ButtonModule
  ],
  templateUrl: './configuracion.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguracionComponent {
  public readonly emisorInfo = signal<GeneriResp<ByApplicationCounter> | null>(null);
  public readonly viewingEmisor = signal<ByApplicationCounter | null>(null);
  public readonly viewingInfo = signal<ByApplicationCounter | null>(null);
  public readonly viewingIdeSubsidiary = signal<number | null>(null);
  public readonly viewingEstablecimiento = signal<any | null>(null);
  public readonly viewingFile = signal<number | null>(null);
  public readonly viewingRuc = signal<any | null>(null);
  public readonly uploadingDoc = signal(false);
  public readonly loading = signal(false);

  constructor(
    private readonly emisorService: EmpresaService,
    public readonly config: ConfigFacturacionService,
  ) {
    this.retrieveEmisor();
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
