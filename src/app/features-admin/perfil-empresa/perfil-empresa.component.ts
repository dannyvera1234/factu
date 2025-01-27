import { NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormatPhonePipe, TextInitialsPipe } from '@/pipes';
import { ModalComponent } from '@/components';
import { GeneriResp } from '@/interfaces';
import { finalize, mergeMap, of } from 'rxjs';
import { CompanyService } from '../../services/service-admin/company.service';

@Component({
  selector: 'app-perfil-empresa',
  imports: [NgClass, RouterLink, TextInitialsPipe, FormatPhonePipe, ModalComponent, NgOptimizedImage],
  templateUrl: './perfil-empresa.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerfilEmpresaComponent {
  public readonly loading = signal(false);

  public readonly company = signal<GeneriResp<any> | null>(null);

  constructor(private readonly companyService: CompanyService) {
    this.allListCompnay();
  }

  allListCompnay() {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.companyService.allListCompany()),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.company.set(resp);
        }
      });
  }
}
