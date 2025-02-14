import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { ModalComponent } from '../../components';
import { NgClass } from '@angular/common';
import { GeneriResp } from '../../interfaces';
import { finalize, mergeMap, of } from 'rxjs';
import { SubsidiaryService } from '../../services/service-empresas';
import { FormatIdPipe, FormatPhonePipe } from '../../pipes';
import { UpdateEstablecimientoComponent } from './components';

@Component({
  selector: 'app-details-establecimiento',
  imports: [ModalComponent, NgClass, FormatPhonePipe, FormatIdPipe, UpdateEstablecimientoComponent],
  templateUrl: './details-establecimiento.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsEstablecimientoComponent {
  @Input({ required: true }) set ideEstablecimientoEncrypted(value: string) {
    this.detailsSubsidiary(value);
  }

  public readonly loading = signal(false);

  public readonly subsidiary = signal<GeneriResp<any> | null>(null);

  public readonly viewingSubsidiary = signal<any | null>(null);

  constructor(private readonly subsidiaryService: SubsidiaryService) {}

  detailsSubsidiary(value: string) {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.subsidiaryService.detailsSubsidiary(value)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.subsidiary.set(resp);
        }
      });
  }

  updateEstable(infoEstablecimiento: any) {
    const subsidiary = this.subsidiary();

    if (subsidiary) {
      const updatedSubsidiary = {
        ...subsidiary,
        data: {
          ...subsidiary.data,
          ...infoEstablecimiento,
        },
      };

      this.subsidiary.set(updatedSubsidiary);
    }
  }
}
