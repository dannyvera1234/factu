import { NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { GeneriResp, ByApplicationCounter } from '@/interfaces';
import { CustomDatePipe, FormatIdPipe, FormatPhonePipe, TextInitialsPipe } from '@/pipes';
import { ConfigFacturacionService } from '@/utils/services';
import { of, mergeMap, finalize } from 'rxjs';
import { CompanyService } from '../../services/service-admin/company.service';
import { ModalComponent } from '../../components';
import { InfoComponent, PlanesComponent } from './components';

@Component({
  selector: 'app-details-empresa',
  imports: [
    NgClass,
    TextInitialsPipe,
    CustomDatePipe,
    FormatPhonePipe,
    FormatIdPipe,
    NgOptimizedImage,
    ModalComponent,
    PlanesComponent,
    InfoComponent,
  ],
  templateUrl: './details-empresa.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsEmpresaComponent {
  @Input() set idePersonaRolEncrypted(value: string) {
    this.getByIdePersona(value);
  }

  public readonly loading = signal(false);

  public readonly counterByPersona = signal<GeneriResp<ByApplicationCounter> | null>(null);

  public readonly uploadingDoc = signal(false);

  public readonly personaRolIde = signal<number | null>(null);

  constructor(
    public readonly config: ConfigFacturacionService,
    private readonly companyService: CompanyService,
  ) {}

  getByIdePersona(idePersonaRol: string) {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.companyService.getCompanyByEmisor(idePersonaRol)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.counterByPersona.set(resp);
        }
      });
  }
}
