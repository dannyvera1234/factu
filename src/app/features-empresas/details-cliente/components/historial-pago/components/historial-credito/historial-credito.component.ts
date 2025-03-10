import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { finalize, mergeMap, of } from 'rxjs';
import { ClientesService } from '@/services/service-empresas';
import { GeneriResp } from '../../../../../../interfaces';
import { CurrencyPipe } from '@angular/common';
import { CustomPipe } from '../../../../../../pipes';

@Component({
  selector: 'app-historial-credito',
  imports: [CurrencyPipe, CustomPipe],
  templateUrl: './historial-credito.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistorialCreditoComponent {
  @Input({ required: true }) set ideLetterPay(value: any) {
    if (!value) return;
    this.abonosLetterPay(value);
  }

  @Output() public readonly showDetails = new EventEmitter<any | null>();
  public readonly historilAbonos = signal<GeneriResp<any> | null>(null);
  public readonly loading = signal(false);

  constructor(private readonly clienteService: ClientesService) {}

  abonosLetterPay(item: any) {
    const data = {
      letterIde: item.ideLetterPay,
      personaRolIdeCustomer: item.idePersonalRol,
    };

    of(this.loading.set(true))
      .pipe(
        mergeMap(() => this.clienteService.abonoLetter(data)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((resp) => {
        if (resp.status === 'OK') {
          this.historilAbonos.set(resp);
        }
      });
  }
}
