import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-historial-credito',
  imports: [],
  templateUrl: './historial-credito.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistorialCreditoComponent {
  @Input({ required: true }) ideLetterPay!: number
}
