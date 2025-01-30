import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { linkWhast } from '../../utils/permissions';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer-web',
  imports: [RouterLink],
  templateUrl: './footer-web.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterWebComponent {
public readonly link = signal(linkWhast);
}
