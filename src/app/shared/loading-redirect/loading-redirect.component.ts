import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoadingRedirectService } from '../services/loading-redirect.service';

@Component({
  selector: 'app-loading-redirect',
  imports: [],
  templateUrl: './loading-redirect.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingRedirectComponent {
  public loadingService = inject(LoadingRedirectService);
}
