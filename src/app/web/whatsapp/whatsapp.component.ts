import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { linkWhast } from '../../utils/permissions';

@Component({
  selector: 'app-whatsapp',
  imports: [],
  templateUrl: './whatsapp.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhatsappComponent {
public readonly link = signal(linkWhast);
}
