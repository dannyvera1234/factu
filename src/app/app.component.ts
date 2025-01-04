import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from './components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'factu';
}
