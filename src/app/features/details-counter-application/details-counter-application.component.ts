import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { finalize, mergeMap, of } from 'rxjs';
import { CountersService } from '../../services/counters.service';
import { ByApplicationCounter, GeneriResp } from '@/interfaces';
import { CustomDatePipe, TextInitialsPipe } from '@/pipes';
import { ConfigFacturacionService } from '@/utils/services';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { FilePickerComponent, ModalComponent } from '@/components';
import { UpdateInfoPersonaComponent, UpdateInfoTributarioComponent } from './components';

@Component({
  selector: 'app-details-counter-application',
  imports: [
    TextInitialsPipe,
    CustomDatePipe,
    NgClass,
    FilePickerComponent,
    ModalComponent,
    UpdateInfoPersonaComponent,
    NgOptimizedImage,
    UpdateInfoTributarioComponent,
  ],
  templateUrl: './details-counter-application.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsCounterApplicationComponent {
  @Input() set idePersonaRolEncrypted(value: string) {
    this.getByIdePersona(value);
  }

  public readonly files = signal<{ type: string; source: string; name: string; id: string }[]>([]);

  public readonly uploadingDoc = signal(false);

  public readonly loading = signal(false);

  public readonly counterByPersona = signal<GeneriResp<ByApplicationCounter> | null>(null);

  constructor(
    private readonly counterService: CountersService,
    public readonly config: ConfigFacturacionService,
  ) {}

  getByIdePersona(idePersonaRol: string) {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.counterService.getCounterByEmisor(idePersonaRol)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => this.counterByPersona.set(resp));
  }

  addFile(file: any) {
    console.log(file);
  }
}
