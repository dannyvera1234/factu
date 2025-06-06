import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { linkWhast } from '../../utils/permissions';
import { HeardComponent } from '../heard';
import { FooterWebComponent } from '../footer-web';
import { WhatsappComponent } from '../whatsapp';

@Component({
  selector: 'app-sobre-nosotros',
  imports: [HeardComponent, FooterWebComponent, WhatsappComponent],
  templateUrl: './sobre-nosotros.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SobreNosotrosComponent {
  public readonly link = signal(linkWhast);
}
