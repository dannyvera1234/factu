import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { finalize, mergeMap, of } from 'rxjs';
import { CountersService } from '../../services/counters.service';
import { ByApplicationCounter, GeneriResp } from '@/interfaces';
import { CustomDatePipe, TextInitialsPipe } from '@/pipes';
import { ConfigFacturacionService } from '@/utils/services';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { ModalComponent } from '@/components';
import {
  CreateEstablecimientoComponent,
  CreateFileComponent,
  DeleteFileComponent,
  DocAutorizadosComponent,
  InfoCardComponent,
  ListClienteComponent,
  ListInventarioComponent,
  UpdateEstablecimientoComponent,
  UpdateInfoPersonaComponent,
  UpdateInfoTributarioComponent,
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

  public readonly selectedTab = signal<'inventario' | 'doc' | 'clientes'>('clientes');

  public readonly loading = signal(false);

  public readonly viewingInfo = signal<ByApplicationCounter | null>(null);

  public readonly viewingFile = signal<number | null>(null);

  public readonly viewingEstablecimiento = signal<any | null>(null);

  public readonly counterByPersona = signal<GeneriResp<ByApplicationCounter> | null>(null);

  constructor(
    private readonly counterService: CountersService,
    public readonly config: ConfigFacturacionService,
  ) {}

  public changeTab(tab: 'inventario' | 'doc' | 'clientes'): void {
    this.selectedTab.set(tab);
  }

  deleteFile(id: Number) {
    console.log(id);
  }

  getByIdePersona(idePersonaRol: string) {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.counterService.getCounterByEmisor(idePersonaRol)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        console.log(resp);
        this.counterByPersona.set(resp);
      });
  }
}
