import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from './components';
import { LoadingRedirectComponent } from './shared/loading-redirect/loading-redirect.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingRedirectComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'factu';
}
