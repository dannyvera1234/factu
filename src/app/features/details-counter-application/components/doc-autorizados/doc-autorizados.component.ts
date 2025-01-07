import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { CurrencyPipe, NgClass } from '@angular/common';
import { CountersService } from '@/services/counters.service';
import { finalize, mergeMap, of } from 'rxjs';
import { GeneriResp } from '@/interfaces';
import { CustomDatePipe, FormatIdPipe } from '@/pipes';
import { ConfigFacturacionService } from '@/utils/services';

@Component({
  selector: 'app-doc-autorizados',
  imports: [ CurrencyPipe, NgClass, FormatIdPipe, CustomDatePipe],
  templateUrl: './doc-autorizados.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocAutorizadosComponent {
  @Input({ required: true }) set idePersonaRol(value: number) {
    this.getListInvoices(value);
  }

  public readonly loading = signal(false);

  public readonly listInvoices = signal<GeneriResp<any[]> | null>(null);

  constructor(private readonly counterService: CountersService,
    public readonly config: ConfigFacturacionService
  ) {}

  getListInvoices(idePersonaRol: number) {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.counterService.getListInvoices(idePersonaRol)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((res) => {
        if (res.status === 'OK') {
          this.listInvoices.set(res);
        }
      });
  }
}
