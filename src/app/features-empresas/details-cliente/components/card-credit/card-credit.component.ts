import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { finalize, mergeMap, of } from 'rxjs';
import { ClientesService } from '../../../../services/service-empresas';
import { GeneriResp } from '../../../../interfaces';
import { CurrencyPipe } from '@angular/common';
import { CustomPipe } from '../../../../pipes';

@Component({
  selector: 'app-card-credit',
  imports: [CurrencyPipe, CustomPipe],
  templateUrl: './card-credit.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardCreditComponent {
  @Input({ required: true }) set idePersonaRol(value: number) {
    this.resumenPago(value);

  }

  @Input({ required: true }) set actulizarCard (value: any) {
    if(!value)return;
    this.resumenPago(value.ide)
  }

  public readonly paymentProgress = computed(() => {
    const total = this.listResumen()?.data!.resumeCreditActive.totalCreditAmount;
    const paid = this.listResumen()?.data!.resumeCreditActive.totalPaidAmount;
    return total > 0 ? (paid / total) * 100 : 0;
  });

  public readonly loading = signal(false);

  public readonly listResumen = signal<GeneriResp<any> | null>(null);

  @Output() public readonly showDetails = new EventEmitter<any | null>();
  constructor(private readonly clienteService: ClientesService) {}

  resumenPago(idePersonaRol: number) {
    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.clienteService.resumenPago(idePersonaRol)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.listResumen.set(resp);
          this.showDetails.emit(resp);
        }
      });
  }
}
